// El backend manda LocalDateTime en hora de México y sin offset: se interpreta como hora local, sin convertir.
// Las respuestas recién guardadas pueden traer nanosegundos, que Safari no parsea; se recortan a milisegundos.
const normalizeDateString = (value) => (
    typeof value === 'string' ? value.replace(/(\.\d{3})\d+/, '$1') : value
);

export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(normalizeDateString(dateString));
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Fecha local en formato yyyy-MM-dd (no usa toISOString, que la pasaría a UTC).
export const toLocalIsoDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Del día 1 del mes actual a hoy, en fechas locales yyyy-MM-dd.
export const currentMonthRange = (today = new Date()) => ({
    from: toLocalIsoDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    to: toLocalIsoDate(today),
});

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0
    }).format(value || 0);
};

export const formatQuantity = (value) => {
    const n = toNumber(value);
    return Math.round((n + Number.EPSILON) * 1000) / 1000;
};

export const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return isFinite(value) ? value : 0;
    const normalized = String(value).replace(',', '.');
    const n = Number(normalized);
    return isFinite(n) ? n : 0;
};
