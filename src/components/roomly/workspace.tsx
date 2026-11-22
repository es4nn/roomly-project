import { createContext, useContext, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  atTime,
  makeDemo,
  validateReservation,
  canCancelReservation,
  validRoomCapacity,
  type Reservation,
  type Room,
  type Workspace,
} from "@/lib/roomly";
import { toast } from "sonner";
const Context = createContext<ReturnType<typeof useWorkspaceState> | null>(null);
function useWorkspaceState(initial: Workspace, live: boolean) {
  const [workspace, setWorkspace] = useState(initial);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const refresh = async () => {
    const { data, error } = await supabase.rpc("roomly_workspace");
    if (error) throw error;
    setWorkspace(data as unknown as Workspace);
    await router.invalidate();
  };
  async function book(roomId: string, date: string, start: string, end: string, title: string) {
    const starts = atTime(date, start),
      ends = atTime(date, end);
    const validation = validateReservation(
      workspace.rooms,
      workspace.reservations,
      roomId,
      starts,
      ends,
      title,
    );
    if (validation) throw new Error(validation);
    if (Date.parse(starts) <= Date.now()) throw new Error("Wybierz przyszły termin spotkania.");
    setBusy(true);
    try {
      if (live && workspace.organization) {
        const { error } = await supabase.rpc("roomly_book", {
          org: workspace.organization.id,
          room: roomId,
          meeting_title: title,
          starts,
          ends,
        });
        if (error)
          throw new Error(
            error.code === "23P01"
              ? "Ktoś właśnie zarezerwował ten termin. Wybierz inne godziny."
              : error.message,
          );
        await refresh();
      } else {
        const row: Reservation = {
          id: crypto.randomUUID(),
          room_id: roomId,
          user_id: workspace.userId,
          title,
          starts_at: starts,
          ends_at: ends,
          status: "active",
        };
        setWorkspace((w) => ({ ...w, reservations: [...w.reservations, row] }));
      }
      toast.success(live ? "Rezerwacja zapisana w Roomly." : "Rezerwacja dodana w trybie demo.");
    } finally {
      setBusy(false);
    }
  }
  async function cancel(id: string) {
    const row = workspace.reservations.find((r) => r.id === id);
    if (!row || !canCancelReservation(row, workspace.userId, workspace.role))
      throw new Error("Nie możesz anulować tej rezerwacji.");
    if (live) {
      const { error } = await supabase.rpc("roomly_cancel", { booking: id });
      if (error) throw new Error(error.message);
      await refresh();
    } else
      setWorkspace((w) => ({
        ...w,
        reservations: w.reservations.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)),
      }));
    toast.success("Rezerwacja anulowana.");
  }
  async function saveRoom(room: Room) {
    if (workspace.role !== "admin") throw new Error("Wymagane uprawnienia administratora.");
    if (!validRoomCapacity(room.capacity) || !room.name.trim())
      throw new Error("Podaj nazwę i dodatnią pojemność sali.");
    if (live && workspace.organization) {
      const { error } = await supabase.rpc("roomly_save_room", {
        org: workspace.organization.id,
        room: room.id || "00000000-0000-0000-0000-000000000000",
        room_name: room.name,
        room_location: room.location,
        room_capacity: room.capacity,
        room_description: room.description,
        room_equipment: room.equipment,
        active: room.is_active,
      });
      if (error) throw new Error(error.message);
      await refresh();
    } else
      setWorkspace((w) => ({
        ...w,
        rooms: room.id
          ? w.rooms.map((r) => (r.id === room.id ? room : r))
          : [...w.rooms, { ...room, id: crypto.randomUUID() }],
      }));
    toast.success(live ? "Sala zapisana." : "Sala zapisana w demo.");
  }
  async function saveProfile(name: string) {
    if (live) {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: name })
        .eq("id", workspace.userId);
      if (error) throw new Error(error.message);
    }
    setWorkspace((w) => ({ ...w, displayName: name }));
    toast.success("Profil zaktualizowany.");
  }
  async function setRole(userId: string, role: string) {
    if (workspace.role !== "admin") throw new Error("Brak uprawnień.");
    if (live && workspace.organization) {
      const { error } = await supabase.rpc("roomly_set_role", {
        org: workspace.organization.id,
        target: userId,
        new_role: role,
      });
      if (error) throw new Error(error.message);
      await refresh();
    } else
      setWorkspace((w) => ({
        ...w,
        members: w.members.map((m) => (m.user_id === userId ? { ...m, role } : m)),
      }));
  }
  return {
    workspace,
    live,
    busy,
    book,
    cancel,
    saveRoom,
    saveProfile,
    setRole,
    refresh,
    changeDemoRole: (role: string) => setWorkspace((w) => ({ ...w, role })),
  };
}
export function WorkspaceProvider({
  children,
  initial,
  live = false,
}: {
  children: ReactNode;
  initial?: Workspace;
  live?: boolean;
}) {
  const state = useWorkspaceState(initial ?? makeDemo(), live);
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export function useWorkspace() {
  const context = useContext(Context);
  if (!context) throw new Error("Workspace is missing");
  return context;
}
