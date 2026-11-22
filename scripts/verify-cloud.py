import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
from datetime import datetime,timedelta
OUT=Path(os.environ.get('ROOMLY_TEST_DIRECTORY','/tmp/browser/roomly')); OUT.mkdir(parents=True,exist_ok=True)
async def restore(browser,path):
 context=await browser.new_context(viewport={'width':1280,'height':1800});page=await context.new_page()
 with open(path) as f:s=json.load(f)
 await page.goto('http://localhost:8080');await page.evaluate('([k,v])=>localStorage.setItem(k,v)',[s['storage_key'],json.dumps(s['session'])]);await page.goto('http://localhost:8080/app/0',wait_until='networkidle');return page
async def rpc(page,name,args):
 return await page.evaluate('''async([name,args])=>{const {supabase}=await import('/src/integrations/supabase/client.ts');const {data,error}=await supabase.rpc(name,args);return {data,error:error?{code:error.code,message:error.message}:null};}''',[name,args])
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True);employee=await restore(browser,os.path.expanduser('~/.cache/lovable-auth/session.json'));admin=await restore(browser,str(OUT/'admin-session.json'))
  ids=json.loads((OUT/'test_ids.json').read_text());org=ids['org'];room=ids['room']; employee_id=(await rpc(employee,'roomly_workspace',{}))['data']['userId']
  print('employee admin button hidden',await employee.get_by_role('button',name='Administracja',exact=True).count()==0)
  forbidden=await rpc(employee,'roomly_save_room',{'org':org,'room':'00000000-0000-0000-0000-000000000000','room_name':'Forbidden','room_location':'','room_capacity':10,'room_description':'','room_equipment':[],'active':True});print('employee room mutation rejected',bool(forbidden['error']))
  escalation=await rpc(employee,'roomly_set_role',{'org':org,'target':employee_id,'new_role':'admin'});print('self promotion rejected',bool(escalation['error']))
  isolated=await employee.evaluate('''async()=>{const {supabase}=await import('/src/integrations/supabase/client.ts');const {data,error}=await supabase.from('rooms').select('*').eq('organization_id','00000000-0000-4000-8000-000000000099');return {count:data?.length,error:!!error};}''');print('foreign rows invisible',isolated['count']==0)
  foreign=await rpc(employee,'roomly_book',{'org':'00000000-0000-4000-8000-000000000099','room':'00000000-0000-4000-8000-000000000098','meeting_title':'Foreign','starts':'2026-11-27T10:00:00Z','ends':'2026-11-27T11:00:00Z'});print('foreign booking denied',bool(foreign['error']))
  employeeWorkspace=await rpc(employee,'roomly_workspace',{});print('foreign meeting title redacted',all(r['title']!='Weryfikacja trwałego zapisu' for r in employeeWorkspace['data']['reservations']))
  day=(datetime.now()+timedelta(days=3)).strftime('%Y-%m-%d');args={'org':org,'room':room,'meeting_title':'Atomic test','starts':day+'T10:00:00Z','ends':day+'T11:00:00Z'}
  first,second=await asyncio.gather(rpc(admin,'roomly_book',args),rpc(employee,'roomly_book',{**args,'meeting_title':'Employee atomic'}))
  print('concurrent booking exactly one succeeds',sum(x['error'] is None for x in [first,second])==1,'codes',[x['error']['code'] if x['error'] else 'success' for x in [first,second]])
  adjacent=await rpc(employee,'roomly_book',{**args,'meeting_title':'Employee allowed','starts':day+'T11:00:00Z','ends':day+'T12:00:00Z'});print('adjacent employee booking accepted',adjacent['error'] is None)
  await employee.reload(wait_until='networkidle');await employee.get_by_role('button',name='Moje rezerwacje',exact=False).click();print('employee write read through UI',await employee.get_by_text('Employee allowed',exact=True).count()==1)
  await employee.screenshot(path=str(OUT/'employee-booking.png'))
  await employee.get_by_role('button',name='Wyloguj się',exact=True).click();await employee.wait_for_url('**/auth');await employee.context.close()
  relogin=await restore(browser,os.path.expanduser('~/.cache/lovable-auth/session.json'));print('session restored booking still visible',await relogin.get_by_text('Employee allowed',exact=True).count()==1)
  results={'employee_room_denied':bool(forbidden['error']),'self_promotion_denied':bool(escalation['error']),'tenant_isolation':isolated['count']==0,'concurrency':sum(x['error'] is None for x in [first,second])==1,'employee_booking':adjacent['error'] is None,'persistence':await relogin.get_by_text('Employee allowed',exact=True).count()==1}
  (OUT/'security_results.json').write_text(json.dumps(results));await browser.close()
asyncio.run(main())
