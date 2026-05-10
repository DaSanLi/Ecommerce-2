"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useLogin } from '@/src/graphql/hooks/useLogin'
import { loginForm } from '@/src/app/auth/types/types'

function LoginForm() {
    const [form, setForm] = useState<loginForm | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { handleLogin, loading, error: loginError } = useLogin()

    const saveForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const newForm: loginForm = {
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value
        }
        setForm(newForm)
        handleSubmit(newForm)
    }

    const handleSubmit = async (formData: loginForm) => {
        setError(null)
        try {
            await handleLogin(formData)
        } catch (err: any) {
            if (err.graphQLErrors) {
                const messages = err.graphQLErrors.map((e: any) => e.message).join(', ')
                setError(messages)
            } else {
                setError('Error al iniciar sesión')
            }
        }
    }

    return (
        <form className="space-y-4"
            onSubmit={(e) => saveForm(e)}
        >
            {error !== null && (
                <p className="text-white bg-red-800 rounded-2xl p-2 text-sm text-center">
                    {error}
                </p>
            )}
            <div>
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-(--text-primary)"
                >
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-(--bg-primary) border border-(--border-color) text-(--text-primary) rounded-lg focus:ring-(--color-primary) focus:border-(--color-primary) block w-full p-3 text-base"
                    placeholder="name@company.com"
                    required
                />
            </div>
            <div>
                <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-(--text-primary)"
                >
                    Contraseña
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-(--bg-primary) border border-(--border-color) text-(--text-primary) rounded-lg focus:ring-(--color-primary) focus:border-(--color-primary) block w-full p-3 text-base"
                    required
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="remember"
                            aria-describedby="remember"
                            type="checkbox"
                            className="w-4 h-4 border border-(--border-color) rounded bg-(--bg-primary) focus:ring-3 focus:ring-(--color-primary)"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label
                            htmlFor="remember"
                            className="text-(--text-secondary)"
                        >
                            Recuérdame
                        </label>
                    </div>
                </div>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-(--color-primary) hover:bg-(--color-secondary) focus:ring-4 focus:outline-none focus:ring-(--color-primary) font-medium rounded-lg text-base px-5 py-3 text-center transition-colors"
            >
                {loading ? 'Cargando...' : 'Entrar'}
            </button>
            <p className="text-sm font-light text-(--text-secondary) text-center">
                ¿No tienes cuenta?{' '}
                <Link
                    href="/auth/register"
                    className="font-medium text-(--color-primary) hover:underline"
                >
                    Regístrate
                </Link>
            </p>
        </form>
    )
}

export default LoginForm
