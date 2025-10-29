
import React, { useState } from 'react';
import { ShareIcon, PaperAirplaneIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export const SecureShare: React.FC = () => {
    const [recipientKey, setRecipientKey] = useState('');
    const [secretToShare, setSecretToShare] = useState('');
    const [isSharing, setIsSharing] = useState(false);
    const [shareSuccess, setShareSuccess] = useState(false);

    const handleShare = (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipientKey || !secretToShare) return;

        setIsSharing(true);
        setShareSuccess(false);

        // Simulate hybrid encryption and P2P sharing
        console.log(`1. Generating a one-time symmetric key for the secret: "${secretToShare}"`);
        console.log(`2. Encrypting the secret with the symmetric key (AES-256 GCM).`);
        console.log(`3. Encrypting the symmetric key with the recipient's public key: "${recipientKey}" (ECC/RSA).`);
        console.log(`4. Sending the encrypted package via a decentralized channel (e.g., IPFS or P2P).`);

        setTimeout(() => {
            setIsSharing(false);
            setShareSuccess(true);
            setRecipientKey('');
            setSecretToShare('');
            setTimeout(() => setShareSuccess(false), 4000);
        }, 2000);
    };

    return (
        <div className="animate-fade-in">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Secure Share</h3>
                <p className="text-gray-400">Share your secrets with end-to-end encryption. The data is encrypted with the recipient's public key, ensuring only they can decrypt it. No central server ever sees the content.</p>
            </div>

            <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
                <form onSubmit={handleShare} className="space-y-6">
                    <div>
                        <label htmlFor="recipientKey" className="block text-sm font-medium text-gray-300 mb-2">
                            Recipient's Public Key or DID
                        </label>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                id="recipientKey"
                                value={recipientKey}
                                onChange={(e) => setRecipientKey(e.target.value)}
                                placeholder="did:aegis:..."
                                required
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-cyan-500 focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="secret" className="block text-sm font-medium text-gray-300 mb-2">
                            Secret to Share (Password, Note, etc.)
                        </label>
                        <textarea
                            id="secret"
                            rows={4}
                            value={secretToShare}
                            onChange={(e) => setSecretToShare(e.target.value)}
                            placeholder="Enter the sensitive information you want to share securely..."
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            disabled={isSharing}
                            className="w-full flex items-center justify-center px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors duration-300 shadow-md disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {isSharing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Encrypting & Sharing...
                                </>
                            ) : (
                                <>
                                    <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                                    Share Securely
                                </>
                            )}
                        </button>
                    </div>
                </form>
                 {shareSuccess && (
                    <div className="mt-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-center">
                        Secret shared successfully!
                    </div>
                )}
            </div>
        </div>
    );
};
