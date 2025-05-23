import { TodoList } from "@/todo/components/todo-list"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/_authed/later")({
   component: RouteComponent,
})

function RouteComponent() {
   return <TodoList />
}
