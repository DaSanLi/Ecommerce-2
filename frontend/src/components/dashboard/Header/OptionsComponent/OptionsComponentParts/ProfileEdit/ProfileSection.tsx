'use client';
import React from 'react'
import UpdateBlackScreen from './UpdateBlackScreen'

type Props = {
    userId: string;
}

function ProfileSection({ userId }: Props) {
    const [ blackOptionScreen, setBlackOptionScreen ] = React.useState<boolean>(false)
    return (
        <>
            {blackOptionScreen && <UpdateBlackScreen userId={userId} setBlackOptionScreen={setBlackOptionScreen} />}
            <div className="space-y-4 lg:space-y-6">
                <h3 className="text-base lg:text-lg font-semibold text-(--text-primary)">Perfil</h3>
                <div className="flex flex-col gap-3 lg:gap-4">
                    <div className="flex flex-col">
                    <button onClick={() => setBlackOptionScreen(prev => !prev)}
                    className="w-full text-left px-4 lg:px-6 py-3 lg:py-4 rounded-xl border border-(--border-color) text-(--text-primary) bg-(--bg-primary) hover:bg-(--bg-secondary) transition text-base lg:text-lg font-medium">
                        Modificar datos de perfil
                    </button>
                </div>
                </div>
            </div>
        </>
    )
}

export default ProfileSection
