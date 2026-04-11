'use client'
import { useState } from "react"
import { useLogout } from "@/src/graphql/hooks/useLogout"
import Link from 'next/link'
import Image from 'next/image'
import optionsIcon from '../../../../assets/settings.png'


function InteractiveHeaderBar() {
    const [optionsBar, setOptionsBar] = useState<boolean>(false)
    const { handleLogout } = useLogout()

    return (
        <>
            <div className="relative">
                <button className="bg-(--color-primary) hover:bg-(--color-secondary) rounded-2xl p-2 lg:p-3"
                    onClick={() => setOptionsBar(prev => !prev)}
                >
                    <Image src={optionsIcon} alt="Options Icon" className="w-6 h-6 lg:w-8 lg:h-8"/>
                </button>
                <aside className={`absolute right-0 top-full mt-2 w-48 lg:w-56 bg-(--color-primary) rounded-2xl shadow-lg flex flex-col gap-3 p-4 z-50
                        ${optionsBar
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-4 pointer-events-none'
                    }   
                        `}>
                    <Link href='/auth/login'
                        className="w-full py-2 bg-white rounded-xl text-sm lg:text-base text-center"
                        onClick={() => {handleLogout()}}>
                        Salir
                    </Link>
                    <Link href='/options'
                        className="w-full py-2 bg-white rounded-xl text-sm lg:text-base text-center">
                        Opciones
                    </Link>
                </aside>
            </div>
        </>
    )
}

export default InteractiveHeaderBar