import { createFileRoute } from '@tanstack/react-router';
import { RoomlyApp } from '@/components/roomly/app';
import { pageHead } from '@/lib/roomly';
export const Route = createFileRoute('/ustawienia')({head:()=>pageHead('Ustawienia — demo'), component:()=> <RoomlyApp page="Ustawienia"/>});
