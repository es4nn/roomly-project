import { createFileRoute } from '@tanstack/react-router';
import { RoomlyApp } from '@/components/roomly/app';
import { pageHead } from '@/lib/roomly';
export const Route = createFileRoute('/sale')({head:()=>pageHead('Sale konferencyjne — demo'), component:()=> <RoomlyApp page="Sale konferencyjne"/>});
