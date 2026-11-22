import { createFileRoute } from '@tanstack/react-router';
import { RoomlyApp } from '@/components/roomly/app';
import { pageHead } from '@/lib/roomly';
export const Route = createFileRoute('/rezerwacje')({head:()=>pageHead('Moje rezerwacje — demo'), component:()=> <RoomlyApp page="Moje rezerwacje"/>});
