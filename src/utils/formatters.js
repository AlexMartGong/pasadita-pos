export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

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
