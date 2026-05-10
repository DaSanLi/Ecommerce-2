import RegisterForm from "@/src/components/auth/register/RegisterForm"

function RegisterPage() {

    return (
        <section className="bg-(--bg-primary) min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-(--bg-secondary) rounded-lg shadow p-6 sm:p-8">
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-(--text-primary) text-center mb-6">
                        Registro
                    </h1>
                    <RegisterForm />
                </div>
            </div>
        </section>
    )
}

export default RegisterPage