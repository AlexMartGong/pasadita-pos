import {useState, useEffect, useCallback, useRef} from 'react';
import {scaleApi} from '../apis/scaleApi';

/**
 * Hook para manejar la báscula
 * @param {Object|boolean} optionsOrAutoUpdate - Opciones de configuración o autoUpdate (compatibilidad)
 * @param {number} legacyIntervalMs - Intervalo en ms (solo para compatibilidad con API anterior)
 */
export const useScale = (optionsOrAutoUpdate = {}, legacyIntervalMs) => {
    // Compatibilidad con API anterior: useScale(true, 500)
    const isLegacyCall = typeof optionsOrAutoUpdate === 'boolean';

    const {
        persistent = false,
        autoUpdate = true,
        intervalMs = 500
    } = isLegacyCall
        ? {autoUpdate: optionsOrAutoUpdate, intervalMs: legacyIntervalMs || 500}
        : optionsOrAutoUpdate;

    const actualIntervalMs = intervalMs;

    const [weight, setWeight] = useState(0);
    const [unit, setUnit] = useState('kg');
    const [isStable, setIsStable] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);
    const mountedRef = useRef(true);

    const readWeight = useCallback(async () => {
        try {
            const response = await scaleApi.get('/weight');

            if (response.data && mountedRef.current) {
                setWeight(response.data.weight || 0);
                setUnit(response.data.unit || 'kg');
                setIsStable(response.data.stable || false);
                setIsConnected(true);
                setError(null);
            }
        } catch (err) {
            if (mountedRef.current) {
                console.error('Error reading weight:', err);
                setError(err.message || 'Error al leer el peso');
                setIsConnected(false);
            }
        }
    }, []);

    const connectScale = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            await scaleApi.post('/connect');
            if (mountedRef.current) {
                setIsConnected(true);
                await readWeight();
            }
        } catch (err) {
            if (mountedRef.current) {
                console.error('Error connecting to scale:', err);
                setError(err.message || 'Error al conectar con la báscula');
                setIsConnected(false);
            }
        } finally {
            if (mountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [readWeight]);

    const disconnectScale = useCallback(async () => {
        try {
            setIsLoading(true);
            await scaleApi.post('/disconnect');
            if (mountedRef.current) {
                setIsConnected(false);
                setWeight(0);
                setIsStable(false);
            }
        } catch (err) {
            if (mountedRef.current) {
                console.error('Error disconnecting from scale:', err);
                setError(err.message || 'Error al desconectar la báscula');
            }
        } finally {
            if (mountedRef.current) {
                setIsLoading(false);
            }
        }
    }, []);

    const checkStatus = useCallback(async () => {
        try {
            const response = await scaleApi.get('/status');
            if (mountedRef.current) {
                setIsConnected(response.data?.connected || false);
            }
            return response.data?.connected || false;
        } catch (err) {
            console.error('Error checking scale status:', err);
            if (mountedRef.current) {
                setIsConnected(false);
            }
            return false;
        }
    }, []);

    // Conexión persistente: conectar al montar
    useEffect(() => {
        mountedRef.current = true;

        if (persistent) {
            const initPersistentConnection = async () => {
                const alreadyConnected = await checkStatus();
                if (!alreadyConnected && mountedRef.current) {
                    await connectScale();
                }
            };
            initPersistentConnection();
        }

        return () => {
            mountedRef.current = false;
            // No desconectar en modo persistente al desmontar
            // La báscula queda conectada para el siguiente componente
        };
    }, [persistent, checkStatus, connectScale]);

    // Polling automático
    useEffect(() => {
        const shouldPoll = (persistent || autoUpdate) && isConnected;

        if (shouldPoll) {
            intervalRef.current = setInterval(readWeight, actualIntervalMs);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [persistent, autoUpdate, isConnected, actualIntervalMs, readWeight]);

    // Verificar estado inicial (solo si no es persistente)
    useEffect(() => {
        if (!persistent) {
            checkStatus();
        }
    }, [persistent, checkStatus]);

    return {
        weight,
        unit,
        isStable,
        isConnected,
        isLoading,
        error,
        readWeight,
        connectScale,
        disconnectScale,
        checkStatus,
    };
};
