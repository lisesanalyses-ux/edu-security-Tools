
import React from 'react';
import { CubeTransparentIcon } from '@heroicons/react/24/solid';

const pqcAlgorithms = [
    { name: "CRYSTALS-Kyber", type: "Key-Encapsulation Mechanism (KEM)", description: "Used for establishing secret keys over a public channel, replacing classical algorithms like RSA and ECC for key exchange." },
    { name: "CRYSTALS-Dilithium", type: "Digital Signature Algorithm", description: "Used for verifying the authenticity and integrity of digital messages, replacing classical signature schemes like ECDSA." },
];

export const QuantumResistanceInfo: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
                 <div className="flex items-center mb-4">
                    <CubeTransparentIcon className="h-12 w-12 text-cyan-400 mr-4"/>
                    <div>
                        <h3 className="text-2xl font-bold text-white">Quantum Resistance</h3>
                        <p className="text-gray-400 mt-1">Preparing for the next generation of security threats.</p>
                    </div>
                </div>
                <p className="text-gray-300">
                    The advent of powerful quantum computers poses a significant threat to current cryptographic standards, such as RSA and Elliptic Curve Cryptography (ECC), which protect most of our digital world today. A sufficiently powerful quantum computer could break these algorithms, rendering our encrypted data vulnerable.
                </p>
                <p className="text-gray-300 mt-4">
                    Aegis Vault is designed with a forward-looking approach, preparing for the integration of Post-Quantum Cryptography (PQC). PQC refers to cryptographic algorithms that are thought to be secure against attacks by both classical and quantum computers.
                </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h4 className="text-xl font-semibold text-white mb-4">Future PQC Implementation</h4>
                <p className="text-gray-400 mb-6">In the near future, Aegis Vault will integrate NIST-standardized PQC algorithms to ensure long-term security:</p>
                
                <div className="space-y-4">
                    {pqcAlgorithms.map(algo => (
                        <div key={algo.name} className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="font-bold text-cyan-400">{algo.name}</h5>
                            <p className="text-sm text-gray-300 font-semibold mb-1">{algo.type}</p>
                            <p className="text-sm text-gray-400">{algo.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-blue-900/50 border border-blue-700 rounded-lg text-blue-200 text-sm">
                    By adopting PQC, Aegis Vault ensures that your identity and data remain secure not just today, but also in the quantum era of tomorrow.
                </div>
            </div>
        </div>
    );
};
