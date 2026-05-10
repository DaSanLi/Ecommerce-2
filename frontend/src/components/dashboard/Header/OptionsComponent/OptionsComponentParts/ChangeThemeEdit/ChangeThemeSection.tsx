'use client';
import { useState } from 'react';
import UpdateBlackScreenTheme from './SwitchThemes/UpdateBlackScreenTheme'

const ChangeThemeSection = () => {
    const [ blackOptionScreenTheme, setBlackOptionScreenTheme ] = useState<boolean>(false)
    return (
        <>
            {blackOptionScreenTheme && <UpdateBlackScreenTheme setBlackOptionScreenTheme={setBlackOptionScreenTheme} />}
            <div className="space-y-4 lg:space-y-6">
                <h3 className="text-base lg:text-lg font-semibold text-(--text-primary)">Cambiar tema</h3>
                <div className="flex flex-col gap-3 lg:gap-4">
                    <button onClick={() => setBlackOptionScreenTheme(prev => !prev)}
                        className="w-full text-left px-4 lg:px-6 py-3 lg:py-4 rounded-xl border border-(--border-color) text-(--text-primary) bg-(--bg-primary) hover:bg-(--bg-secondary) transition text-base lg:text-lg font-medium">
                        Cambiar tema
                    </button>
                </div>
            </div>
        </>
    )
}

export default ChangeThemeSection