'use client'
import React, { useContext } from 'react'
import { Button } from "@/components/ui/button";
import ThemeContext from '@/context/ThemeContext'; // Import the theme context
import { Moon, Sun } from 'lucide-react';

function ThemeToggle() {
    const { theme, toggleTheme } = useContext(ThemeContext); // Use theme context
    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center"
            >
                {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="text-white h-[1.2rem] w-[1.2rem]" />}
            </Button>
        </>
    )
}

export default ThemeToggle