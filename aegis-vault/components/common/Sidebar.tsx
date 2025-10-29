
import React from 'react';
import { Module } from '../../types';
import { ShieldCheckIcon, UserCircleIcon, LockClosedIcon, ShareIcon, CubeTransparentIcon, HomeIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
    activeModule: Module;
    setActiveModule: (module: Module) => void;
}

const navItems = [
    { module: Module.DASHBOARD, icon: HomeIcon },
    { module: Module.IDENTITY, icon: UserCircleIcon },
    { module: Module.VAULT, icon: LockClosedIcon },
    { module: Module.SECURE_SHARE, icon: ShareIcon },
    { module: Module.QUANTUM_RESISTANCE, icon: CubeTransparentIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
    return (
        <aside className="w-16 md:w-64 bg-gray-800 text-gray-300 flex flex-col">
            <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-gray-700">
                <ShieldCheckIcon className="h-8 w-8 text-cyan-400" />
                <h1 className="hidden md:block ml-3 text-xl font-bold text-white">Aegis Vault</h1>
            </div>
            <nav className="flex-1 px-2 md:px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.module}
                        onClick={() => setActiveModule(item.module)}
                        className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                            activeModule === item.module
                                ? 'bg-cyan-500 text-white'
                                : 'hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <item.icon className="h-6 w-6" />
                        <span className="hidden md:block ml-4 font-medium">{item.module}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                 <p className="hidden md:block text-xs text-center text-gray-500">Zero-Knowledge Architecture</p>
            </div>
        </aside>
    );
};
