import { createFileRoute } from '@tanstack/react-router';
import { RoomlyApp } from '@/components/roomly/app';
import { pageHead } from '@/lib/roomly';
export const Route = createFileRoute('/administracja')({head:()=>pageHead('Administracja — demo'), component:()=> <RoomlyApp page="Administracja"/>});
