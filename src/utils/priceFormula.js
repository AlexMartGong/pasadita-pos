// Precio por kilo calculado desde el costo de la caja. Utilidad pura: sin React ni dependencias.
//
//   precio = redondearArriba( (costoCaja + flete) / (kilosCaja − merma) + gastosExtra )
//
// kilosCaja es el peso bruto (báscula o captura); la merma cubre también el peso del envase.

export const roundTo = (n, factor) => Math.round((n + Number.EPSILON) * factor) / factor;

const KILOS = 1000;
const MONEY = 100;

const BASE_DEFAULTS = {boxCost: '', freight: '10', boxKilos: '', shrinkage: '1.5', extraPerKilo: '20'};

// Valores iniciales del diálogo por categoría (texto, como se capturan). Que una categoría tenga
// entrada aquí es lo que la hace elegible: para sumar otra basta con agregarla.
export const PRICE_FORMULA_DEFAULTS = {
    FRUTAS: BASE_DEFAULTS,
    VERDURAS: BASE_DEFAULTS,
};

// Valores iniciales del producto, o null si no usa la fórmula (solo productos por kilo).
export const formulaDefaults = (product) =>
    (product?.unitMeasure === 'KILOGRAMO' && PRICE_FORMULA_DEFAULTS[product.category]) || null;

// Recibe números (pesos MXN y kilos) y regresa el desglose, o {valid: false} si algún dato falta
// o no cumple las reglas.
export const calculatePrice = ({boxCost, freight, boxKilos, shrinkage, extraPerKilo}) => {
    if (![boxCost, freight, boxKilos, shrinkage, extraPerKilo].every(Number.isFinite)) return {valid: false};
    if (boxCost <= 0 || boxKilos <= 0 || freight < 0 || shrinkage < 0 || extraPerKilo < 0) return {valid: false};

    const kilos = roundTo(boxKilos, KILOS);
    const usableKilos = roundTo(kilos - shrinkage, KILOS);
    if (usableKilos <= 0) return {valid: false};

    const costPerKilo = roundTo((boxCost + freight) / usableKilos, MONEY);
    const rawPrice = roundTo(costPerKilo + extraPerKilo, MONEY);

    return {
        valid: true,
        usableKilos,
        shrinkPct: roundTo((shrinkage / kilos) * 100, 10),
        costPerKilo,
        rawPrice,
        // Se sube al peso siguiente sobre el valor ya redondeado: un 68.0000000001 no pasa a 69.
        price: Math.ceil(rawPrice),
    };
};
