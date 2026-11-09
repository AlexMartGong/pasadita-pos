import {useRegisterSW} from 'virtual:pwa-register/react';

// Las terminales pasan el día con la pestaña abierta: sin esta revisión el navegador solo buscaría un sw.js nuevo
// al navegar o cada ~24 h.
export const UPDATE_CHECK_INTERVAL_MS = 15 * 60 * 1000;

const checkForUpdate = (registration) => {
    if (!registration || registration.installing || navigator.onLine === false) return;
    // Un corte de red momentáneo no debe terminar en un unhandled rejection.
    registration.update().catch(() => {
    });
};

/**
 * Registra el Service Worker en modo prompt y avisa cuando hay una versión nueva esperando.
 * useRegisterSW toma las opciones una sola vez (registro único por vida de la app), así que el intervalo no
 * necesita limpieza. En desarrollo el módulo virtual es un stub y no registra nada.
 */
export const usePwaUpdate = () => {
    const {needRefresh: [needRefresh], updateServiceWorker} = useRegisterSW({
        onRegisteredSW(_swUrl, registration) {
            setInterval(() => checkForUpdate(registration), UPDATE_CHECK_INTERVAL_MS);
        },
    });

    // Envía SKIP_WAITING al SW en espera; workbox-window recarga la página cuando el nuevo SW toma el control.
    const updateApp = () => updateServiceWorker(true);

    return {needRefresh, updateApp};
};
