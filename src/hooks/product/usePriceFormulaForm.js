import {useState} from 'react';
import {toNumber} from '../../utils/formatters.js';
import {calculatePrice, formulaDefaults, roundTo} from '../../utils/priceFormula.js';
import {useBoxWeightCapture} from './useBoxWeightCapture.js';

// Orden de captura = orden del cálculo.
const FIELD_ORDER = ['boxCost', 'freight', 'boxKilos', 'shrinkage', 'extraPerKilo'];

// Solo dígitos y un separador decimal (punto o coma): el campo nunca guarda texto inválido ni
// negativos.
const DECIMAL_INPUT = /^\d*[.,]?\d*$/;

/**
 * Formulario del diálogo "Calcular precio". Nada de lo capturado se guarda: solo el precio final,
 * a través de `onSave(price) → boolean` (el flujo de guardado de la tarjeta).
 */
export const usePriceFormulaForm = ({product, onSave, onClose}) => {
    const [values, setValues] = useState(() => ({...formulaDefaults(product)}));
    // false = los kilos siguen a la báscula; true = fijados (el usuario escribió o tomó el peso).
    const [pinned, setPinned] = useState(false);
    const [saving, setSaving] = useState(false);
    const [autoFocusField] = useState(() => FIELD_ORDER.find((key) => values[key] === ''));
    const scale = useBoxWeightCapture();

    const fields = {
        ...values,
        boxKilos: pinned || scale.autoWeight === null ? values.boxKilos : String(scale.autoWeight),
    };

    const setField = (key, text) => {
        if (!DECIMAL_INPUT.test(text)) return;
        setValues((prev) => ({...prev, [key]: text}));
        if (key === 'boxKilos') setPinned(true);
    };

    // Ajuste rápido − / +: nunca baja de 0.
    const stepField = (key, delta) => {
        setValues((prev) => ({...prev, [key]: String(Math.max(0, roundTo(toNumber(prev[key]) + delta, 1000)))}));
    };

    // Copia la lectura actual aunque el campo ya se haya editado, y lo deja fijado.
    const takeWeight = () => {
        if (scale.liveWeight === null) return;
        setValues((prev) => ({...prev, boxKilos: String(scale.liveWeight)}));
        setPinned(true);
    };

    // Vacío cuenta como 0: costo y kilos quedan inválidos, flete/merma/gastos simplemente no suman.
    const numbers = Object.fromEntries(FIELD_ORDER.map((key) => [key, toNumber(fields[key])]));
    const breakdown = calculatePrice(numbers);

    const errors = {
        boxCost: fields.boxCost !== '' && numbers.boxCost <= 0 ? 'El costo debe ser mayor a 0' : '',
        boxKilos: fields.boxKilos !== '' && numbers.boxKilos <= 0 ? 'Los kilos deben ser mayores a 0' : '',
        shrinkage: numbers.boxKilos > 0 && numbers.shrinkage >= numbers.boxKilos
            ? 'La merma debe ser menor a los kilos de la caja'
            : '',
    };

    const priceDiff = breakdown.valid ? roundTo(breakdown.price - toNumber(product.price), 100) : 0;

    // Cierra solo si se guardó; si falla, el diálogo se queda con lo capturado para reintentar.
    const submit = async () => {
        if (!breakdown.valid || saving) return;
        setSaving(true);
        const ok = await onSave(breakdown.price);
        if (ok) {
            onClose();
        } else {
            setSaving(false);
        }
    };

    return {
        fields,
        numbers,
        errors,
        breakdown,
        priceDiff,
        pinned,
        saving,
        autoFocusField,
        scale,
        setField,
        stepField,
        takeWeight,
        submit,
    };
};
