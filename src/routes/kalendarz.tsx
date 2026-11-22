import { createFileRoute } from "@tanstack/react-router";
import { RoomlyApp } from "@/components/roomly/app";
import { pageHead } from "@/lib/roomly";
export const Route = createFileRoute("/kalendarz")({
  head: () => pageHead("Kalendarz — demo"),
  component: () => <RoomlyApp page="Kalendarz" />,
});
