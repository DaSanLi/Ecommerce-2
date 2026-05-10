'use client'
import { useTasks } from "@/src/graphql/hooks/useTasks"
import NewTaskSection from "../NewTask/NewTaskSection"
import KanbanBoard from "../KanbanBoard/KanbanBoard"

interface Props {
    className?: string
}

function TaskList({ className = '' }: Props) {
    const { tasks, loading, error } = useTasks()

    if (loading) return <p>Cargando tareas...</p>
    if (error) return <p>Error al cargar tareas</p>

    return (
        <section
            className={`w-full flex flex-1 flex-col gap-1 px-4 py-10 text-base bg-(--bg-primary) border-0 m-0 ${className}`}
            aria-label="Tablero de tareas"
        >
            <header className="mb-6 lg:mb-8 flex items-center justify-between">
                <h1 className="text-base lg:text-2xl text-(--text-primary)">
                    Tablero de tareas
                </h1>
                <NewTaskSection />
            </header>
            <KanbanBoard tasks={tasks} className="flex-1" />
        </section>
    )
}

export default TaskList
