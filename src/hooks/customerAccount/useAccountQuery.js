import {useCallback, useEffect, useEffectEvent, useState} from "react";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {ACCOUNT_ERROR_MESSAGES, ACCOUNT_ERROR_OPTIONS} from "./accountErrorOptions.js";

// Lectura que se pide al abrir una vista. `requestKey` identifica lo que se pide (null = no pedir nada):
// al cambiar, se descarta la respuesta anterior para no mostrar datos de otro cliente o nota. `reload`
// vuelve a pedir y mantiene los datos actuales en pantalla mientras llega la respuesta.
export const useAccountQuery = (requestKey, fetcher) => {
    const {handleApiError} = useApiErrorHandler();
    const [reloadCount, setReloadCount] = useState(0);
    const [result, setResult] = useState({key: null, reloadCount: -1, data: null, failed: false});

    const runFetch = useEffectEvent(() => fetcher());
    const reportError = useEffectEvent((error) => {
        handleApiError(error, ACCOUNT_ERROR_MESSAGES, ACCOUNT_ERROR_OPTIONS);
    });

    useEffect(() => {
        if (requestKey === null) return;
        let cancelled = false;
        runFetch()
            .then((data) => {
                if (!cancelled) setResult({key: requestKey, reloadCount, data, failed: false});
            })
            .catch((error) => {
                if (cancelled) return;
                reportError(error);
                setResult((previous) => ({
                    key: requestKey,
                    reloadCount,
                    data: previous.key === requestKey ? previous.data : null,
                    failed: true,
                }));
            });
        return () => {
            cancelled = true;
        };
    }, [requestKey, reloadCount]);

    const reload = useCallback(() => setReloadCount((count) => count + 1), []);

    const isCurrentKey = requestKey !== null && result.key === requestKey;
    return {
        data: isCurrentKey ? result.data : null,
        loading: requestKey !== null && (!isCurrentKey || result.reloadCount !== reloadCount),
        failed: isCurrentKey && result.failed,
        reload,
    };
};
