'use client'
import { useState, useMemo } from 'react'
import { ThemeContext } from './ThemeContext';

export default function ThemeProvider({ children, }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<string>('dark');

    const value = useMemo(() => ({ theme, setTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>)
}