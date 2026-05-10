import Link from "next/link"

const ReturnDashBoard = () => {
    return (
        <div className="space-y-4 lg:space-y-6">
            <h3 className="text-base lg:text-lg font-semibold text-(--text-primary)">Salir del panel de configuración</h3>
            <div className="flex flex-col gap-3 lg:gap-4">
                <Link href='/dashboard' className="w-full text-left px-4 lg:px-6 py-3 lg:py-4 rounded-xl border border-(--border-color) text-(--text-primary) bg-(--bg-primary) hover:bg-(--bg-secondary) transition text-base lg:text-lg font-medium">
                    Ir a inicio
                </Link>
            </div>
        </div>
    )
}

export default ReturnDashBoard