
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { Dashboard } from './components/Dashboard';
import { IdentityManager } from './components/IdentityManager';
import { Vault } from './components/Vault';
import { SecureShare } from './components/SecureShare';
import { QuantumResistanceInfo } from './components/QuantumResistanceInfo';
import { Module } from './types';

const App: React.FC = () => {
    const [activeModule, setActiveModule] = useState<Module>(Module.DASHBOARD);

    const renderModule = () => {
        switch (activeModule) {
            case Module.IDENTITY:
                return <IdentityManager />;
            case Module.VAULT:
                return <Vault />;
            case Module.SECURE_SHARE:
                return <SecureShare />;
            case Module.QUANTUM_RESISTANCE:
                return <QuantumResistanceInfo />;
            case Module.DASHBOARD:
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 font-sans">
            <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header activeModule={activeModule} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 sm:p-6 lg:p-8">
                    {renderModule()}
                </main>
            </div>
        </div>
    );
};

export default App;
