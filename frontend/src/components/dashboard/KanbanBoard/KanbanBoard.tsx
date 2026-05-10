'use client'
import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import isEqual from 'lodash/isEqual'
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    rectIntersection,
} from '@dnd-kit/core'
import { Task, taskStatus } from '../TaskList/types'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'
import { useMoveTask } from '@/src/graphql/hooks/useMoveTask'

interface Props {
    tasks: Task[]
    className?: string
}

const COLUMNS: { id: taskStatus; title: string }[] = [
    { id: 'pendiente', title: 'Pendiente' },
    { id: 'asignada', title: 'Asignada' },
    { id: 'realizando', title: 'Realizando' },
    { id: 'completada', title: 'Completada' },
]

export default function KanbanBoard({ tasks, className = '' }: Props) {
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [localTasks, setLocalTasks] = useState<Task[]>(tasks)
    const localTasksRef = useRef<Task[]>(localTasks)
    const { moveTask } = useMoveTask()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    )

    useEffect(() => {
        if (!isEqual(tasks, localTasks)) {
            setLocalTasks(tasks);
        }
    }, [tasks]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sincronizar ref con localTasks
    useEffect(() => {
        localTasksRef.current = localTasks;
    }, [localTasks]);

    const tasksByColumn = useMemo(() => {
        const grouped: Record<string, Task[]> = {
            pendiente: [],
            asignada: [],
            realizando: [],
            completada: [],
        }
        localTasks.forEach((task) => {
            if (!task.status) {
                throw new Error(`Task ${task.id} missing required field: status`);
            }
            const status = task.status;
            if (!grouped[status]) grouped[status] = []
            grouped[status].push(task)
        })
        Object.keys(grouped).forEach((key) => {
            grouped[key].sort((a, b) => a.orderInStatus - b.orderInStatus)
        })
        return grouped
    }, [localTasks])

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const task = localTasks.find((t) => t.id === event.active.id)
        if (task) setActiveTask(task)
    }, [localTasks]);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const activeTask = localTasksRef.current.find((t) => t.id === activeId)
        if (!activeTask) return

            const activeStatus = activeTask.status
        const overId = over.id as string

        let overStatus = activeStatus

        if (COLUMNS.some(col => col.id === overId)) {
            overStatus = overId as taskStatus
        } else {
            const overTask = localTasksRef.current.find((t) => t.id === overId)
            if (overTask) {
                overStatus = overTask.status
            }
        }

        if (activeStatus !== overStatus) {
            setLocalTasks((prev) => {
                return prev.map((t) => {
                    if (t.id === activeId) {
                        return { ...t, status: overStatus }
                    }
                    return t
                })
            })
        }
    }, []);

    const handleDragEnd = useCallback(async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveTask(null)

        if (!over) {
            setLocalTasks(tasks)
            return
        }

        const activeId = active.id as string
        const overId = over.id as string

        const activeTask = localTasks.find((t) => t.id === activeId)
        if (!activeTask) return

        let newStatus = activeTask.status
        let newOrder = 0

        if (COLUMNS.some(col => col.id === overId)) {
            newStatus = overId as taskStatus
            newOrder = tasksByColumn[newStatus]?.length || 0
        } else {
            const overTask = localTasks.find((t) => t.id === overId)
            if (overTask) {
                newStatus = overTask.status
                const columnTasks = tasksByColumn[newStatus] || []
                const overIndex = columnTasks.findIndex(t => t.id === overId)
                newOrder = overIndex >= 0 ? overIndex : columnTasks.length
            }
        }

        const columnTasks = [...(tasksByColumn[newStatus] || [])]
        const oldIndex = columnTasks.findIndex(t => t.id === activeId)
        
        if (oldIndex === -1 || oldIndex !== newOrder) {
            if (oldIndex !== -1) {
                columnTasks.splice(oldIndex, 1)
            }
            columnTasks.splice(newOrder > oldIndex ? newOrder : newOrder, 0, activeTask)
            
            const updatedColumn = columnTasks.map((t, idx) => ({
                ...t,
                orderInStatus: idx,
            }))

             setLocalTasks((prev) => {
                 const otherTasks = prev.filter(t => t.status !== newStatus)
                 return [...otherTasks, ...updatedColumn]
             })
        }

        try {
            const result = await moveTask(activeId, newStatus, newOrder);
            if (!result.success) {
                console.error('Error moviendo tarea:', result.error);
            }
        } catch (error) {
            console.error('Error inesperado:', error);
        }
    }, [localTasks, tasks, tasksByColumn, moveTask]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className={`flex gap-4 lg:gap-8 h-full overflow-x-auto pb-4 px-3 lg:pb-8 lg:px-6 snap-x snap-mandatory ${className}`}>
                {COLUMNS.map((column) => (
                    <KanbanColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        tasks={tasksByColumn[column.id] || []}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeTask ? <KanbanCard task={activeTask} isDragging /> : null}
            </DragOverlay>
        </DndContext>
    )
}
