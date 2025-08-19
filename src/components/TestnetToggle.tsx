import { useTestnetState } from "../hooks/useTestnetState";

export function TestnetToggle() {
    const { isEnabled, toggleTestnets } = useTestnetState();

    return (
        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
      <span className="text-sm font-medium text-gray-700">
        Show Testnets
      </span>
            <button
                onClick={toggleTestnets}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    isEnabled
                        ? 'bg-green-600'
                        : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={isEnabled}
                aria-label="Toggle testnet networks"
            >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
            </button>
        </div>
    );
}