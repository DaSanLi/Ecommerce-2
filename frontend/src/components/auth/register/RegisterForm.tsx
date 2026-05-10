"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useRegister } from '@/src/graphql/hooks/useRegister'
import { registerForm } from '@/src/app/auth/types/types'

function RegisterForm() {
    const [error, setError] = useState<string | null>(null)
    const { handleRegister, loading } = useRegister()

    const saveForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const password: string = e.currentTarget.password.value
        const verifyPassword: string = e.currentTarget.verifyPassword.value
        
        if (password !== verifyPassword) {
            setError("Tu contraseña no coincide con su verificación, vuelve a intentarlo")
            return
        }
        
        const newForm: registerForm = {
            email: e.currentTarget.email.value,
            fullName: e.currentTarget.fullName.value,
            gender: e.currentTarget.gender.value,
            password,
        }
        
        try {
            await handleRegister(newForm)
        } catch (err: any) {
            if (err.graphQLErrors) {
                const messages = err.graphQLErrors.map((e: any) => e.message).join(', ')
                setError(messages)
            } else {
                setError('Error al registrar')
            }
        }
    }

    return (
        <form className="space-y-4" onSubmit={(e) => saveForm(e)}>
            {error && (
                <p className="text-white bg-red-800 rounded-2xl p-2 text-sm text-center">
                    {error}
                </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-(--text-primary)">
                        Nombre completo
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        autoComplete="off"
                        placeholder="Tu nombre"
                        className="bg-(--bg-primary) border border-(--border-color) text-(--text-primary) text-base rounded-lg focus:ring-(--color-primary) focus:border-(--color-primary) block w-full p-3"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-(--text-primary)">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="email@email.com"
                        className="bg-(--bg-primary) border border-(--border-color) text-(--text-primary) text-base rounded-lg focus:ring-(--color-primary) focus:border-(--color-primary) block w-full p-3"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-(--text-primary)">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        autoComplete="off"
                        placeholder="••••••••"
                        className="bg-(--bg-primary) border border-(--border-color) text-(--text-primary) text-base rounded-lg focus:ring-(--color-primary) focus:border-(--color-primary) block w-full p-3"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="verifyPassword" className="block mb-2 text-sm font-medium text-(--text-primary)">
                        Confirmar contraseña
                    </label>
                    <input
                        type="password"
                        name="verifyPassword"
                        id="verifyPassword"
                        autoComplete="off"
                        placeholder="••••••••"
                        className="bg-(--bg-primary) border border-(--border-color) text-(--text-primary) text-base rounded-lg focus:ring-(--color-primary) focus:border-(--color-primary) block w-full p-3"
                        required
                    />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="gender" className="block mb-2 text-sm font-medium text-(--text-primary)">
                        Género
                    </label>
                    <select
                        name="gender"
                        id="gender"
                        className="text-(--text-primary) bg-(--bg-primary) border border-(--border-color) rounded-lg w-full p-3 focus:border-(--color-primary) focus:ring-(--color-primary) text-base"
                        required
                    >
                        <option value="">Selecciona tu género</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                    </select>
                </div>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-(--color-primary) hover:bg-(--color-secondary) focus:ring-4 focus:outline-none focus:ring-(--color-primary) font-medium rounded-lg text-base px-5 py-3 text-center transition-colors"
            >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
            <p className="text-sm font-light text-(--text-secondary) text-center">
                ¿Ya tienes cuenta?{' '}
                <Link
                    href="/auth/login"
                    className="font-medium text-(--color-primary) hover:underline"
                >
                    Iniciar sesión
                </Link>
            </p>
        </form>
    )
}

export default RegisterForm
