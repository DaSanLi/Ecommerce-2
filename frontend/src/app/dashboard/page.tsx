import Header from "@/src/components/dashboard/Header/Header"
import TaskList from "@/src/components/dashboard/TaskList/TaskList"

function DarshboardPage() {
    return (
        <main className="w-full min-h-screen bg-(--bg-primary) text-(--text-primary) flex flex-col">
            <Header />
            <TaskList className="flex-1 w-full" />
        </main>
    )
}

export default DarshboardPage