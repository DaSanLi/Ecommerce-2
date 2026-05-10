'use client'
import InteractiveHeaderBar from "./HeaderComponents/InteractiveHeaderBar"

const Header = () => {
    return (
        <header className="relative w-full mb-4">
            <section className="bg-(--bg-secondary) w-full text-(--color-primary) flex justify-between items-center px-4 py-2 lg:py-3">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                    To-Do App
                </h1>
                <InteractiveHeaderBar />
            </section>
        </header>
    )
}

export default Header