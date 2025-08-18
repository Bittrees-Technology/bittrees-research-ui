import { useEffect } from "react";
import { LayoutData, useLayoutContext } from "@/hooks/useLayoutContext.tsx";

export function useSetLayoutData(data: LayoutData) {
    const { setLayoutData } = useLayoutContext();

    useEffect(() => {
        setLayoutData(data);

        // Reset on unmount
        return () => setLayoutData({});
    }, [
        setLayoutData,
        data.title,
        data.showBackButton,
        data.backButtonText,
        data.backButtonTo,
    ]);
}