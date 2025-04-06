import { TodoList } from "@/todo/components/todo-list"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/_authed/")({
   component: RouteComponent,
})

function RouteComponent() {
   return <TodoList forToday />
}
