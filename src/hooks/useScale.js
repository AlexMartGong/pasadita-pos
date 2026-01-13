import {useState, useEffect, useCallback, useRef} from 'react';
import {scaleApi} from '../apis/scaleApi';

export const useScale = (autoUpdate = true, intervalMs = 500) => {
    const [weight, setWeight] = useState(0);
    const [unit, setUnit] = useState('kg');
    const [isStable, setIsStable] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);

    const readWeight = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await scaleApi.get('/weight');

            if (response.data) {
                setWeight(response.data.weight || 0);
                setUnit(response.data.unit || 'kg');
                setIsStable(response.data.stable || false);
                setIsConnected(true);
            }
        } catch (err) {
            console.error('Error reading weight:', err);
            setError(err.message || 'Error al leer el peso');
            setIsConnected(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const connectScale = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            await scaleApi.post('/connect');
            setIsConnected(true);
            await readWeight();
        } catch (err) {
            console.error('Error connecting to scale:', err);
            setError(err.message || 'Error al conectar con la báscula');
            setIsConnected(false);
        } finally {
            setIsLoading(false);
        }
    }, [readWeight]);

    const disconnectScale = useCallback(async () => {
        try {
            setIsLoading(true);
            await scaleApi.post('/disconnect');
            setIsConnected(false);
            setWeight(0);
            setIsStable(false);
        } catch (err) {
            console.error('Error disconnecting from scale:', err);
            setError(err.message || 'Error al desconectar la báscula');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const checkStatus = useCallback(async () => {
        try {
            const response = await scaleApi.get('/status');
            setIsConnected(response.data?.connected || false);
        } catch (err) {
            console.error('Error checking scale status:', err);
            setIsConnected(false);
        }
    }, []);

    // Polling automático
    useEffect(() => {
        if (autoUpdate && isConnected) {
            intervalRef.current = setInterval(readWeight, intervalMs);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [autoUpdate, isConnected, intervalMs, readWeight]);

    // Verificar estado inicial
    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

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
    };
};
