'use client'
import { useDeleteTask } from "@/src/graphql/hooks/useDeleteTask"
import { Task } from "./types"
import { useState } from "react"
import NewTask from "../NewTask/NewTask"

interface Props {
    tasks: Task[]
}

function Tasks({ tasks }: Props) {
    const [newTaskPanel, setNewTaskPanel] = useState<boolean>(false)
    const [idUpdate, setIdUpdate] = useState<string>("")
    const { handleDeleteTask } = useDeleteTask()

    function updateTaskPanel(id: string) {
        setNewTaskPanel(prev => !prev)
        setIdUpdate(id)
    }

    async function deleteTask(id: string) {
        await handleDeleteTask(id)
    }

    return (
        <>
            {newTaskPanel && <NewTask setNewTaskPanel={setNewTaskPanel} requiredOptionalsInputs={false} idUpdate={idUpdate} />}
            {tasks?.length === 0
                ? <p>No tienes tareas agregadas.</p>
                :
                tasks?.map(task => (
                    <article
                        key={task.id}
                        className="flex flex-col gap-3 p-4 rounded-xl
                    bg-(--bg-secondary)
                    border border-(--border-color)
                    hover:shadow-md
                    transition-shadow"
                    >
                        <header className="flex items-start justify-between">
                            <span
                                className="px-3 py-1 rounded-full text-xs
                            bg-(--color-primary)/10
                            text-(--color-primary)"
                            >
                                {task.priority}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-1 rounded-md
                                text-(--text-secondary)
                                hover:text-(--color-primary)
                                hover:bg-(--bg-primary)
                                transition-colors"
                                    onClick={() => updateTaskPanel(String(task.id))}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="p-1 rounded-md
                                text-(--text-secondary)
                                hover:text-red-500
                                hover:bg-(--bg-primary)
                                transition-colors"
                                    onClick={() => deleteTask(String(task.id))}
                                >
                                    🗑️
                                </button>
                            </div>
                        </header>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-(--text-primary)">
                                {task.title}
                            </h3>
                            <p className="text-(--text-secondary)">
                                {task.description}
                            </p>
                        </div>
                    </article>
                ))
            }
        </>
    )
}
export default Tasks
