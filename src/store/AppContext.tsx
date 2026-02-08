// src/store/AppContext.tsx
import React, { createContext, useContext } from 'react';
import { useAppStore } from './appStore';

type AppContextValue = ReturnType<typeof useAppStore>;

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const store = useAppStore((s) => s); // subscribe to whole state
    return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error('useAppContext must be used inside AppProvider');
    }
    return ctx;
};
