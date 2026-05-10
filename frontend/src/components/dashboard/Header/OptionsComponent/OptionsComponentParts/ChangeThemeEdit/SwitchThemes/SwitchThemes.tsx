"use client"
import { ThemeContext } from "@/src/context/ThemeContext/ThemeContext"
import { useContext, useEffect } from "react"

function SwitchThemes() {

    const { theme, setTheme } = useContext(ThemeContext)

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme);
        }
    }, [setTheme]);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    function saveTheme(e: React.FormEvent<HTMLFormElement>): void {
        setTheme(e.currentTarget?.changeTheme.value)
    }

    return (
        <form onChange={(e) => saveTheme(e)}>
            <select name="changeTheme" id="changeTheme" className="bg-(--bg-primary) text-center p-3 lg:p-4 rounded-2xl text-(--text-primary) text-base lg:text-lg">
                <option>Elige un tema</option>
                <option value="light">light</option>
                <option value="dark">dark</option>
                <option value="midnight">midnight</option>
            </select>
        </form>
    )
}

export default SwitchThemes