import { createFileRoute } from "@tanstack/solid-router"
import { TodoList } from "@/todo/components/todo-list"

export const Route = createFileRoute("/_authed/")({
   component: RouteComponent,
})

function RouteComponent() {
   return <TodoList forToday />
}
