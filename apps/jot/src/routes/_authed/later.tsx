import { createFileRoute } from "@tanstack/solid-router"
import { TodoList } from "@/todo/components/todo-list"

export const Route = createFileRoute("/_authed/later")({
   component: RouteComponent,
})

function RouteComponent() {
   return <TodoList />
}
