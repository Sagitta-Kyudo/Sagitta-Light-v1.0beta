import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm border-b border-indigo-500/30">
            <h1 className="text-xl font-bold text-cyan-300 tracking-wider">Sagitta Light v1.0</h1>
        </header>
    );
};
