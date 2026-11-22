import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Workspace } from './roomly';
export const getWorkspace = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.rpc('roomly_workspace');
  if (error) throw new Error('Nie udało się pobrać organizacji. Spróbuj ponownie.');
  return data as unknown as Workspace;
});
