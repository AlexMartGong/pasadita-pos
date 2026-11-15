import {useState} from 'react';
import {useScale} from '../useScale.js';
import {roundTo} from '../../utils/priceFormula.js';

/**
 * Lectura de la báscula para pesar una caja (mismo agente y patrón que QuantityInput).
 * - liveWeight: lectura actual en kg, o null si no hay báscula o no hay peso válido.
 * - autoWeight: último peso estable > 0. Al quitar la caja conserva el valor; nunca vuelve a 0.
 * El sondeo de useScale vive mientras el componente esté montado.
 */
export const useBoxWeightCapture = () => {
    const {weight, isStable, isConnected, isLoading, connectScale} = useScale({persistent: true});

    const liveWeight = isConnected && Number.isFinite(weight) && weight > 0 ? roundTo(weight, 1000) : null;

    // Ajuste de estado durante el render (sin efecto): solo al llegar un peso estable distinto.
    const [autoWeight, setAutoWeight] = useState(null);
    if (liveWeight !== null && isStable && liveWeight !== autoWeight) {
        setAutoWeight(liveWeight);
    }

    return {isConnected, isLoading, liveWeight, autoWeight, reconnect: connectScale};
};
