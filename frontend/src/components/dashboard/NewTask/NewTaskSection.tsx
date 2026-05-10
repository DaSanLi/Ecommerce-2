'use client'
import React from 'react'
import NewTask from './NewTask'

function NewTaskSection() {
    const [ newTaskPanel, setNewTaskPanel ] = React.useState<boolean>(false)
    return (
        <section>
            <button onClick={ () => setNewTaskPanel(prev => !prev) }
            className="bg-(--color-primary) hover:bg-(--color-primary)/50 text-white font-bold py-3 px-6 text-base lg:text-lg lg:py-4 lg:px-8 rounded">
            Agregar tarea</button>
            {newTaskPanel && <NewTask setNewTaskPanel={setNewTaskPanel} requiredOptionalsInputs={true}/>}
        </section>
    )
}

export default NewTaskSection