'use client';
import { genderType } from "@/src/app/auth/types/types";
import { useUpdateUser } from "@/src/graphql/hooks/useUpdateUser";
import { SetStateAction, useState } from "react";

type props = {
    userId: string;
    setBlackOptionScreen: React.Dispatch<SetStateAction<boolean>>;
}

export default function UpdateBlackScreen({ userId, setBlackOptionScreen }: props) {
    const [message, setMessage] = useState<string>("Los campos dejados en blanco no serán modificados");
    const { handleUpdateUser, loading, error } = useUpdateUser(() => {
        setMessage("Usuario actualizado correctamente");
    });

    const saveForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const password: string = e.currentTarget?.password.value;
        const verifyPassword: string = e.currentTarget?.verifyPassword.value;
        const fullName: string = e.currentTarget?.fullName.value;
        const gender: genderType = e.currentTarget?.gender.value;

        if (password !== verifyPassword && password && verifyPassword) {
            setMessage("Las contraseñas no coinciden");
            return;
        }

        try {
            await handleUpdateUser(userId, {
                fullName: fullName || undefined,
                password: password || undefined,
                gender: gender || undefined,
            });
        } catch (err) {
            setMessage("Error al actualizar usuario");
        }
    };

    const exitButton = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setBlackOptionScreen(prev => !prev)
    };

    return (
        <section className="fixed inset-0 z-50 w-screen h-screen bg-black/85 flex items-center justify-center">
            <div className="relative w-80 lg:w-96 h-auto bg-(--bg-secondary)/95 text-white rounded-3xl py-6 lg:py-8 px-4 lg:px-6">
                <h4 className="text-lg lg:text-xl mb-4">Ingresa tus datos</h4>
                <p className={`rounded-2xl my-2 p-2 lg:p-3 text-center text-sm lg:text-base
                    ${message === "Los campos dejados en blanco no serán modificados" ? "bg-red-800" : "bg-green-800"}`}
                >
                    {message}
                </p>
                <form className="h-full w-full flex items-center flex-col my-3 lg:my-4"
                    onSubmit={(e) => saveForm(e)}>
                    <div className="flex flex-col my-3 lg:my-4 gap-2 lg:gap-3">
                        <label htmlFor="fullName" className="block mb-2 text-base lg:text-lg font-medium text-(--text-primary)">
                            Ingresa tu nombre completo
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            placeholder="name and lastname"
                            className="w-full lg:w-72 bg-(--bg-primary) border border-(--border-color) text-(--text-primary) text-base lg:text-lg rounded-lg focus:ring-(--color-primary) focus:border-(--color-primary) block p-3 lg:p-3.5"
                        />
                    </div>
                    <div className="flex flex-col my-3 lg:my-4 gap-2 lg:gap-3">
                        <label htmlFor="password" className="block mb-2 text-base lg:text-lg font-medium text-(--text-primary)">
                            Ingresa tu contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="off"
                            placeholder="••••••••"
                            className="w-full lg:w-72 bg-(--bg-primary) border border-(--border-color) text-(--text-primary) text-base lg:text-lg rounded-lg focus:ring-(--color-primary) focus:border-(--color-primary) block p-3 lg:p-3.5"
                        />
                    </div>
                    <div className="flex flex-col gap-2 lg:gap-3">
                        <label htmlFor="verifyPassword" className="block mb-2 text-base lg:text-lg font-medium text-(--text-primary)">
                            Verifica tu contraseña
                        </label>
                        <input
                            type="password"
                            name="verifyPassword"
                            id="verifyPassword"
                            autoComplete="off"
                            placeholder="••••••••"
                            className="w-full lg:w-72 bg-(--bg-primary) border border-(--border-color) text-(--text-primary) text-base lg:text-lg rounded-lg focus:ring-(--color-primary) focus:border-(--color-primary) block p-3 lg:p-3.5"
                        />
                        <div className="flex flex-col my-3 lg:my-4 gap-2 lg:gap-3">
                            <select
                                name="gender"
                                id="gender"
                                className="text-(--text-primary) bg-(--bg-primary) border border-(--border-color) rounded-2xl w-full h-auto p-3 lg:p-3.5 focus:border-(--color-primary) focus:ring-(--color-primary)"
                            >
                                <option value="">Selecciona tu género</option>
                                <option value="male">Masculino</option>
                                <option value="female">Femenino</option>
                            </select>
                        </div>
                    </div>
                    <div className="absolute bottom-4 lg:bottom-6 right-4 lg:right-6 flex flex-row gap-2 lg:gap-3">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="p-3 lg:p-4 bg-(--color-primary) hover:bg-(--color-primary)/50 rounded-2xl min-w-28 lg:min-w-32"
                        >
                            {loading ? 'Modificando...' : 'Modificar'}
                        </button>
                        <button className="p-3 lg:p-4 bg-(--color-secondary) hover:bg-(--color-secondary)/50 rounded-2xl min-w-28 lg:min-w-32"
                            onClick={(e) => exitButton(e)}
                        >
                            Salir
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}
