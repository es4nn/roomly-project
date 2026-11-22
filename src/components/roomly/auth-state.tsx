import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";
export const AuthStateContext = createContext<{ user: User | null; recovery: boolean }>({
  user: null,
  recovery: false,
});
export function useRoomlyAuth() {
  return useContext(AuthStateContext);
}
