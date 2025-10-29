
export enum Module {
    DASHBOARD = 'Dashboard',
    IDENTITY = 'Identity Core',
    VAULT = 'Vault',
    SECURE_SHARE = 'Secure Share',
    QUANTUM_RESISTANCE = 'Quantum Resistance',
}

export interface VaultItem {
    id: string;
    type: 'password' | 'note';
    title: string;
    content: string; // This would be encrypted in a real application
    createdAt: string;
}

export interface UserIdentity {
    publicKey: string;
    privateKey: string; // In reality, this should never be stored directly like this
    did: string;
}
