import imageCompression from 'browser-image-compression';

// Opciones de compresión: redimensiona a 800px (lado más largo), calidad 0.8 y
// fuerza la salida a WebP. useWebWorker descarga el trabajo del hilo principal
// para que la UI siga respondiendo durante la compresión.
const COMPRESSION_OPTIONS = {
    maxWidthOrHeight: 800,
    initialQuality: 0.8,
    fileType: 'image/webp',
    useWebWorker: true,
};

/**
 * Comprime una imagen y la convierte a WebP antes de subirla.
 * La librería conserva el nombre/extensión original, por lo que envolvemos el
 * resultado en un nuevo File con extensión .webp y type image/webp.
 *
 * Lanza el error si la compresión falla; el llamador decide el fallback.
 *
 * @param {File} file Imagen original seleccionada por el usuario.
 * @returns {Promise<File>} Imagen comprimida en formato WebP.
 */
export const compressImageToWebP = async (file) => {
    const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
    const base = (file.name || 'image').replace(/\.[^/.]+$/, '') || 'image';
    return new File([compressed], `${base}.webp`, {
        type: 'image/webp',
        lastModified: Date.now(),
    });
};
