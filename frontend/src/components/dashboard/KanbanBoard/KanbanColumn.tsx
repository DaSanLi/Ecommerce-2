'use client'
import { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task, taskStatus } from '../TaskList/types'
import KanbanCard from './KanbanCard'

interface Props {
    id: taskStatus
    title: string
    tasks: Task[]
}

export default function KanbanColumn({ id, title, tasks }: Props) {
    const { setNodeRef, isOver } = useDroppable({ id })
    const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

    return (
        <div
            ref={setNodeRef}
            className={`min-w-72 lg:min-w-80 flex-1 h-full flex flex-col gap-4 lg:gap-6 p-3 mt-2 sm:p-4 lg:p-8 rounded-xl 
                bg-(--bg-secondary) border border-(--border-color)
                ${isOver ? 'ring-2 ring-(--color-primary) bg-(--color-primary)/5' : ''}`}
        >
            <header className="flex items-center justify-between pb-3 border-b border-(--border-color)">
                <h2 className="text-(--text-primary) font-semibold text-base sm:text-lg lg:text-xl">{title}</h2>
                <span className="px-2 lg:px-3 py-0.5 text-sm lg:text-base rounded-full bg-(--color-primary)/20 text-(--color-primary)">
                    {tasks.length}
                </span>
            </header>
            <div className="flex flex-col gap-3 lg:gap-4 min-h-40 sm:min-h-50 lg:min-h-64 overflow-y-auto">
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasks.length === 0 ? (
                        <div className="flex items-center justify-center h-20 text-(--text-secondary) text-sm opacity-50">
                            Sin tareas
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <KanbanCard key={task.id} task={task} />
                        ))
                    )}
                </SortableContext>
            </div>
        </div>
    )
}


