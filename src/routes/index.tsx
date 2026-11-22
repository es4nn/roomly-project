import { createFileRoute } from "@tanstack/react-router";
import { RoomlyApp } from "@/components/roomly/app";
import { pageHead } from "@/lib/roomly";
export const Route = createFileRoute("/")({
  head: () => pageHead("Dashboard — demo"),
  component: () => <RoomlyApp page="Dashboard" />,
});
