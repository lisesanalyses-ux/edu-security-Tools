
import React, { useState } from 'react';
import { VaultItem } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const mockVaultItems: VaultItem[] = [
    { id: '1', type: 'password', title: 'Work Email', content: 'SuperSecretPassword123', createdAt: new Date().toISOString() },
    { id: '2', type: 'note', title: 'Project Ideas', content: 'Build a decentralized identity manager.', createdAt: new Date().toISOString() },
    { id: '3', type: 'password', title: 'Social Media', content: 'AnotherStrongPass!@#', createdAt: new Date().toISOString() },
];

const VaultItemRow: React.FC<{ item: VaultItem; onDelete: (id: string) => void }> = ({ item, onDelete }) => {
    const [revealed, setRevealed] = useState(false);
    
    return (
        <tr className="bg-gray-800 hover:bg-gray-700/50 transition-colors">
            <td className="p-4 font-medium text-white">{item.title}</td>
            <td className="p-4 text-gray-400 capitalize">{item.type}</td>
            <td className="p-4 font-mono text-sm text-gray-300">
                {item.type === 'password' ? (
                    <div className="flex items-center space-x-2">
                        <span>{revealed ? item.content : '••••••••••••••'}</span>
                        <button onClick={() => setRevealed(!revealed)} className="text-gray-400 hover:text-white">
                            {revealed ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>
                ) : (
                    <span className="truncate block max-w-xs">{item.content}</span>
                )}
            </td>
            <td className="p-4 text-gray-500 text-sm">{new Date(item.createdAt).toLocaleDateString()}</td>
            <td className="p-4 text-right">
                <button className="p-2 text-gray-400 hover:text-cyan-400"><PencilIcon className="h-5 w-5" /></button>
                <button onClick={() => onDelete(item.id)} className="p-2 text-gray-400 hover:text-red-400"><TrashIcon className="h-5 w-5" /></button>
            </td>
        </tr>
    );
};

export const Vault: React.FC = () => {
    const [items, setItems] = useState<VaultItem[]>(mockVaultItems);

    const handleDelete = (id: string) => {
        setItems(currentItems => currentItems.filter(item => item.id !== id));
    };

    return (
        <div className="animate-fade-in">
             <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Encrypted Vault</h3>
                <p className="text-gray-400">Your vault contains sensitive information, encrypted locally using your master key. The data is only decrypted on your device when you need it.</p>
            </div>

            <div className="flex justify-end mb-4">
                <button className="flex items-center px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors">
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add New Item
                </button>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="p-4 font-semibold text-gray-300">Title</th>
                                <th className="p-4 font-semibold text-gray-300">Type</th>
                                <th className="p-4 font-semibold text-gray-300">Content</th>
                                <th className="p-4 font-semibold text-gray-300">Created</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? (
                                items.map(item => <VaultItemRow key={item.id} item={item} onDelete={handleDelete} />)
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-gray-500">
                                        Your vault is empty. Add a new item to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
