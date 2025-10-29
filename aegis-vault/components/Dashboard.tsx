
import React from 'react';
import { Module } from '../types';
import { ShieldCheckIcon, UserCircleIcon, LockClosedIcon, ShareIcon, CubeTransparentIcon } from '@heroicons/react/24/solid';

const featureCards = [
    {
        module: Module.IDENTITY,
        icon: UserCircleIcon,
        title: "Identity Core",
        description: "Manage your Decentralized Identity (DID). Your keys, your identity."
    },
    {
        module: Module.VAULT,
        icon: LockClosedIcon,
        title: "Encrypted Vault",
        description: "Locally store and manage your passwords and sensitive notes with AES-256 GCM encryption."
    },
    {
        module: Module.SECURE_SHARE,
        icon: ShareIcon,
        title: "Secure Sharing",
        description: "Share secrets end-to-end encrypted without relying on a central server."
    },
     {
        module: Module.QUANTUM_RESISTANCE,
        icon: CubeTransparentIcon,
        title: "Quantum Ready",
        description: "Built with post-quantum cryptographic principles for future-proof security."
    }
];

export const Dashboard: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
                <div className="flex items-center">
                    <ShieldCheckIcon className="h-12 w-12 text-cyan-400 mr-4"/>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Welcome to Aegis Vault</h1>
                        <p className="text-gray-400 mt-1">Your sovereign space for digital identity and data security.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featureCards.map((card) => (
                    <div key={card.module} className="bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-300">
                        <card.icon className="h-10 w-10 text-cyan-400 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                        <p className="text-gray-400 text-sm">{card.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Core Principles</h3>
                <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start"><strong className="text-cyan-400 mr-2 w-40">Zero-Knowledge:</strong> We never have access to your master password or your data.</li>
                    <li className="flex items-start"><strong className="text-cyan-400 mr-2 w-40">End-to-End Encryption:</strong> All data is encrypted at rest and in transit, using your keys.</li>
                    <li className="flex items-start"><strong className="text-cyan-400 mr-2 w-40">Decentralization:</strong> You control your data without reliance on centralized servers.</li>
                    <li className="flex items-start"><strong className="text-cyan-400 mr-2 w-40">Open Source:</strong> Transparent and auditable code to ensure trust and security.</li>
                </ul>
            </div>
        </div>
    );
};
