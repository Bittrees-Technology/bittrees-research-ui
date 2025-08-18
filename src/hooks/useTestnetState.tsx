import { useState, useEffect } from "react";

export function useTestnetState() {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        // Load preference from localStorage on mount
        const stored = localStorage.getItem('bittrees-enable-testnets');
        const enabled = stored === 'true';
        setIsEnabled(enabled);
    }, []);

    useEffect(() => {
        // Set CSS data attribute for styling
        document.documentElement.setAttribute(
            'data-testnet-disabled',
            (!isEnabled).toString()
        );
    }, [isEnabled]);

    const toggleTestnets = () => {
        const newValue = !isEnabled;
        setIsEnabled(newValue);
        localStorage.setItem('bittrees-enable-testnets', newValue.toString());
    };

    return {
        isEnabled,
        toggleTestnets,
    };
}