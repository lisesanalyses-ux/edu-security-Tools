
import React from 'react';
import { Module } from '../../types';

interface HeaderProps {
    activeModule: Module;
}

export const Header: React.FC<HeaderProps> = ({ activeModule }) => {
    return (
        <header className="h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-gray-800 border-b border-gray-700">
            <h2 className="text-2xl font-semibold text-white">{activeModule}</h2>
            {/* Additional header content can go here, e.g., user profile, settings */}
        </header>
    );
};
