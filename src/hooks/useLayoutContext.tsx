import { createContext, useContext, useState, ReactNode } from 'react';

export interface LayoutData {
    title?: string;
    showBackButton?: boolean;
    backButtonText?: string;
    backButtonTo?: string;
}

interface LayoutContextType {
    layoutData: LayoutData;
    setLayoutData: (data: LayoutData) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
    const [layoutData, setLayoutData] = useState<LayoutData>({});

    return (
        <LayoutContext.Provider value={{ layoutData, setLayoutData }}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayoutContext() {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayoutContext must be used within LayoutProvider');
    }
    return context;
}