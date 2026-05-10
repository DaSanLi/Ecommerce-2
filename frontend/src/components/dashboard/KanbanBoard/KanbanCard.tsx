'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDeleteTask } from "@/src/graphql/hooks/useDeleteTask"
import { Task } from '../TaskList/types'
import { useState } from 'react'
import NewTask from '../NewTask/NewTask'

const priorityColors: Record<string, string> = {
    baja: 'bg-green-500/20 text-green-400',
    media: 'bg-yellow-500/20 text-yellow-400',
    alta: 'bg-orange-500/20 text-orange-400',
    urgente: 'bg-red-500/20 text-red-400',
}

interface Props {
    task: Task
    isDragging?: boolean
}

export default function KanbanCard({ task, isDragging }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: task.id })
    const { handleDeleteTask } = useDeleteTask()
    const [newTaskPanel, setNewTaskPanel] = useState<boolean>(false)

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    async function deleteTask() {
        await handleDeleteTask(task.id)
    }

    return (
        <>
            {newTaskPanel && <NewTask setNewTaskPanel={setNewTaskPanel} requiredOptionalsInputs={false} idUpdate={task.id} />}
            <article
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className={`flex flex-col gap-3 lg:gap-4 p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl cursor-grab active:cursor-grabbing
                    bg-(--bg-primary)
                    border border-(--border-color)
                    hover:shadow-md
                    transition-all
                    ${isSortableDragging ? 'opacity-40 scale-95' : ''}
                    ${isDragging ? 'shadow-xl scale-105 z-50 ring-2 ring-(--color-primary)' : ''}`}
            >
                <header className="flex items-start justify-between gap-2">
                    <span className={`px-2 lg:px-3 py-0.5 rounded-full text-sm lg:text-base whitespace-nowrap ${priorityColors[task.priority] || priorityColors.media}`}>
                        {task.priority}
                    </span>
                    <div className="flex items-center gap-1 lg:gap-2">
                        <button
                            className="p-2 sm:p-1.5 lg:p-2 rounded-md text-(--text-secondary) hover:text-(--color-primary) hover:bg-(--bg-secondary) transition-colors text-base lg:text-lg"
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); setNewTaskPanel(true) }}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            ✏️
                        </button>
                        <button
                            className="p-2 sm:p-1.5 lg:p-2 rounded-md text-(--text-secondary) hover:text-red-500 hover:bg-(--bg-secondary) transition-colors text-base lg:text-lg"
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteTask() }}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            🗑️
                        </button>
                    </div>
                </header>
                <div className="flex flex-col gap-1 lg:gap-2">
                    <h3 className="text-(--text-primary) font-medium text-base sm:text-lg lg:text-xl line-clamp-2">{task.title}</h3>
                    <p className="text-(--text-secondary) text-sm lg:text-base line-clamp-2">{task.description}</p>
                </div>
            </article>
        </>
    )
}
