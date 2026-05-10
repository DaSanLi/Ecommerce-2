'use client'
import { useCreateTask } from "@/src/graphql/hooks/useCreateTask"
import { useUpdateTask } from "@/src/graphql/hooks/useUpdateTask"

type props = {
    setNewTaskPanel: React.Dispatch<React.SetStateAction<boolean>>
    requiredOptionalsInputs: boolean;
    idUpdate?: string;
}

function NewTask({ setNewTaskPanel, requiredOptionalsInputs, idUpdate }: props) {

    const { handleCreateTask: createTask } = useCreateTask(() => setNewTaskPanel(prev => !prev))
    const { handleUpdateTask: updateTask } = useUpdateTask(() => setNewTaskPanel(prev => !prev))

    const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formClass = new FormData(e.currentTarget)
        const title = formClass.get('title')
        const priority = formClass.get('priority')
        const description = formClass.get('description')
        
        if (idUpdate) {
            await updateTask(idUpdate, { title: String(title), priority: String(priority), description: String(description) })
        } else {
            await createTask({ title: String(title), priority: String(priority), description: String(description) })
        }
    }

    return (
        <section className="fixed inset-0 z-50 w-screen h-screen bg-black/85 flex items-center justify-center">
            <form onSubmit={(e) => formSubmit(e)}
                className="w-full max-w-md mx-auto flex flex-col bg-(--bg-primary) gap-4 p-6 rounded-md shadow-lg">
                <header>
                    <h2 className="text-(--text-primary)">
                        Nueva tarea
                    </h2>
                </header>

                {/* Título */}
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="title"
                        className="text-(--text-secondary)"
                    >
                        Título
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Escribe el título de la tarea"
                        className="w-full px-4 py-2 bg-(--bg-secondary) border border-(--border-color) rounded-md
                    text-(--text-primary)
                    focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        required={requiredOptionalsInputs}
                    />
                </div>

                {/* Prioridad */}
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="priority"
                        className="text-(--text-secondary)"
                    >
                        Prioridad
                    </label>
                    <select
                        id="priority"
                        name="priority"
                        className="px-4 py-2 bg-(--bg-secondary) border border-(--border-color) rounded-md
                    text-(--text-primary)
                    focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        required={requiredOptionalsInputs}
                    >
                        <option value="">Selecciona una prioridad</option>
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                        <option value="urgente">Urgente</option>
                    </select>
                </div>

                {/* Descripción */}
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="description"
                        className="text-(--text-secondary)"
                    >
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Describe la tarea (opcional)"
                        rows={4}
                        className="w-full px-4 py-2 bg-(--bg-secondary) border border-(--border-color) rounded-md
                        text-(--text-primary)
                        resize-none
                        focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        required={requiredOptionalsInputs}
                    />
                </div>

                {/* Acción */}
                <footer className="flex justify-end gap-2">
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-md text-white
                    bg-(--color-primary)
                    hover:bg-(--color-primary)/50
                    transition-colors"
                    >
                        Agregar tarea
                    </button>
                    <button
                        className="px-5 py-2 rounded-md text-white
                    bg-red-800 hover:bg-red-800/50 transition-colors"
                        onClick={(e) => { e.preventDefault(); setNewTaskPanel(prev => !prev) }}
                    >
                        Cancelar
                    </button>
                </footer>
            </form>
        </section>
    )
}

export default NewTask