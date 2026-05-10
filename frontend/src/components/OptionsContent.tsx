'use client'
import { useCurrentUser } from '@/src/graphql/hooks/useCurrentUser'
import ProfileSection from '@/src/components/dashboard/Header/OptionsComponent/OptionsComponentParts/ProfileEdit/ProfileSection'
import ChangeThemeSection from '@/src/components/dashboard/Header/OptionsComponent/OptionsComponentParts/ChangeThemeEdit/ChangeThemeSection'
import ReturnDashBoard from '@/src/components/dashboard/Header/OptionsComponent/OptionsComponentParts/ReturnDashboardSection/ReturnDashBoard'

export default function OptionsContent() {
  const { user, loading, error } = useCurrentUser()

  if (loading) {
    return (
      <main className="h-sreen w-screen">
        <article className="w-full min-h-screen flex items-center justify-center bg-(--bg-primary)">
          <p className="text-(--text-primary)">Cargando...</p>
        </article>
      </main>
    )
  }

  if (error || !user) {
    return (
      <main className="h-sreen w-screen">
        <article className="w-full min-h-screen flex items-center justify-center bg-(--bg-primary)">
          <p className="text-(--text-primary)">Error al cargar usuario</p>
        </article>
      </main>
    )
  }

  return (
    <main className="h-sreen w-screen">
      <article className="w-full min-h-screen flex items-center justify-center bg-(--bg-primary) overflow-hidden px-4 py-8 lg:px-8 lg:py-12">
        <section className="w-full max-w-full sm:max-w-lg lg:max-w-xl rounded-2xl border border-(--border-color) p-6 lg:p-10 space-y-6 lg:space-y-8 bg-(--bg-secondary) shadow-md overflow-auto">
          <div className="text-center">
            <div className="mx-auto mb-4 h-20 w-20 lg:h-24 lg:w-24 rounded-full flex items-center justify-center text-2xl lg:text-3xl font-semibold bg-(--color-primary)/10 text-(--color-primary)">
              {user.fullName?.charAt(0) || '?'}
            </div>
            <h2 className="text-xl lg:text-2xl font-semibold text-(--text-primary)">{user.fullName}</h2>
            <p className="text-base lg:text-lg text-(--text-secondary)">{user.email}</p>
          </div>
          <hr className="border border-(--border-color)" />
          <ProfileSection userId={user.id} />
          <hr className="border border-(--border-color)" />
          <ChangeThemeSection />
          <hr className="border border-(--border-color)" />
          <ReturnDashBoard />
        </section>
      </article>
    </main>
  )
}
