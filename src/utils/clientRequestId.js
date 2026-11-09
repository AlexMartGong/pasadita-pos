// Id de idempotencia para cobros y abonos: se genera al abrir el diálogo y se reutiliza en cada reintento.
// crypto.randomUUID solo existe en contextos seguros (HTTPS o localhost); al probar desde el celular por IP
// de la red local se arma un UUID v4 con crypto.getRandomValues, que sí está disponible.

const bytesToUuid = (bytes) => {
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const createClientRequestId = () => {
    if (typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return bytesToUuid(crypto.getRandomValues(new Uint8Array(16)));
};
