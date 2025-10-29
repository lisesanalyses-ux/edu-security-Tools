
import React, { useState, useCallback } from 'react';
import { UserIdentity } from '../types';
import { SparklesIcon, KeyIcon, ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

// In a real app, this would use a robust crypto library. This is for demonstration.
const generateMockIdentity = (): UserIdentity => {
    const privateKey = `priv_key_${[...Array(64)].map(() => Math.random().toString(36)[2]).join('')}`;
    const publicKey = `pub_key_${[...Array(64)].map(() => Math.random().toString(36)[2]).join('')}`;
    const did = `did:aegis:${publicKey.substring(8, 24)}`;
    return { privateKey, publicKey, did };
};

const KeyDisplay: React.FC<{ title: string; value: string; sensitive?: boolean }> = ({ title, value, sensitive = false }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isRevealed, setIsRevealed] = useState(!sensitive);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const displayValue = isRevealed ? value : '•'.repeat(value.length);

    return (
        <div className="bg-gray-700 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-400 mb-2">{title}</h4>
            <div className="flex items-center space-x-2">
                <KeyIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <p className="font-mono text-sm text-cyan-300 break-all flex-1">{displayValue}</p>
                {sensitive && (
                    <button onClick={() => setIsRevealed(!isRevealed)} className="text-gray-400 hover:text-white">
                        {isRevealed ? 'Hide' : 'Show'}
                    </button>
                )}
                <button onClick={handleCopy} className="p-1 rounded-md hover:bg-gray-600 transition-colors">
                    {isCopied ? <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-400" /> : <ClipboardDocumentIcon className="h-5 w-5 text-gray-400" />}
                </button>
            </div>
        </div>
    );
};

export const IdentityManager: React.FC = () => {
    const [identity, setIdentity] = useState<UserIdentity | null>(null);

    const handleGenerateIdentity = useCallback(() => {
        setIdentity(generateMockIdentity());
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-2">Identity Core</h3>
                <p className="text-gray-400">This module manages your Decentralized Identity (DID). Your identity is derived from a unique cryptographic key pair, generated and stored only on your device.</p>
            </div>

            {!identity ? (
                <div className="mt-8 flex flex-col items-center justify-center bg-gray-800 rounded-lg p-12 text-center shadow-lg">
                    <SparklesIcon className="h-16 w-16 text-cyan-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white">No Identity Found</h3>
                    <p className="text-gray-400 mt-2 mb-6 max-w-md">Create a new identity to start using Aegis Vault. This will generate your unique private key which acts as the root of your digital sovereignty.</p>
                    <button
                        onClick={handleGenerateIdentity}
                        className="flex items-center justify-center px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors duration-300 shadow-md"
                    >
                        <SparklesIcon className="h-5 w-5 mr-2" />
                        Generate New Identity
                    </button>
                </div>
            ) : (
                <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Your Decentralized Identity</h3>
                    <div className="space-y-4">
                        <KeyDisplay title="Decentralized Identifier (DID)" value={identity.did} />
                        <KeyDisplay title="Public Key" value={identity.publicKey} />
                        <KeyDisplay title="Private Key (Secret)" value={identity.privateKey} sensitive />
                    </div>
                    <div className="mt-6 p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg text-yellow-200 text-sm">
                        <p><strong>Warning:</strong> Your private key provides full access to your identity and data. Never share it with anyone. Store it securely.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
