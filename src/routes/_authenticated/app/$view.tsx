import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getWorkspace } from '@/lib/workspace.functions';
import { pageHead, pages } from '@/lib/roomly';
import { WorkspaceProvider } from '@/components/roomly/workspace';
import { RoomlyApp } from '@/components/roomly/app';
const workspaceQuery = { queryKey: ['roomly-workspace'], queryFn: () => getWorkspace() };
export const Route = createFileRoute('/_authenticated/app/$view')({ loader: ({context})=>context.queryClient.ensureQueryData(workspaceQuery), head: ({params})=>pageHead(pages.find((_,i)=>String(i)===params.view) ?? 'Organizacja'), component: AppPage });
function AppPage() { const {view}=Route.useParams(); const {data}=useSuspenseQuery(workspaceQuery); const page=pages.find((_,i)=>String(i)===view) ?? 'Dashboard'; return <WorkspaceProvider key={data.userId} initial={data} live><RoomlyApp page={page}/></WorkspaceProvider>; }
