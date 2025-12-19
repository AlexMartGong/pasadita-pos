import { createRoot } from 'react-dom/client';
import { Ticket } from '../components/sale/Ticket';

/**
 * Imprime un ticket de venta o pedido
 * @param {Object} ticketData - Datos del ticket obtenidos del backend
 * @returns {Promise<void>}
 */
export const printTicket = async (ticketData) => {
    if (!ticketData) {
        console.error('No hay datos del ticket para imprimir');
        return;
    }

    // Crear un contenedor temporal para el ticket
    const printContainer = document.createElement('div');
    printContainer.id = 'print-ticket-container';
    printContainer.style.position = 'fixed';
    printContainer.style.top = '0';
    printContainer.style.left = '0';
    printContainer.style.width = '80mm';
    printContainer.style.zIndex = '10000';
    printContainer.style.backgroundColor = 'white';

    document.body.appendChild(printContainer);

    try {
        // Renderizar el componente Ticket en el contenedor temporal
        const root = createRoot(printContainer);
        root.render(<Ticket ticketData={ticketData} />);

        // Log para debugging
        console.log('Ticket renderizado, datos:', ticketData);
        console.log('Número de productos:', ticketData.saleDetails?.length || 0);

        // Esperar a que el navegador complete el renderizado
        await new Promise((resolve) => {
            // Usar requestAnimationFrame para esperar a que el navegador termine de pintar
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Esperar un poco más para asegurar que los estilos se apliquen
                    setTimeout(resolve, 500);
                });
            });
        });

        console.log('Abriendo diálogo de impresión...');

        // Abrir el diálogo de impresión
        window.print();

        // Esperar un momento antes de limpiar
        setTimeout(() => {
            root.unmount();
            if (document.body.contains(printContainer)) {
                document.body.removeChild(printContainer);
            }
        }, 1000);
    } catch (error) {
        console.error('Error al imprimir el ticket:', error);
        console.error('Datos del ticket:', ticketData);
        // Limpiar el contenedor en caso de error
        if (document.body.contains(printContainer)) {
            document.body.removeChild(printContainer);
        }
    }
};

/**
 * Vista previa del ticket sin imprimir (útil para debugging)
 * @param {Object} ticketData - Datos del ticket obtenidos del backend
 * @returns {void}
 */
export const previewTicket = (ticketData) => {
    if (!ticketData) {
        console.error('No hay datos del ticket para previsualizar');
        return;
    }

    console.log('Vista previa del ticket:', ticketData);

    // Crear un contenedor temporal para previsualización
    const previewContainer = document.createElement('div');
    previewContainer.id = 'preview-ticket-container';
    previewContainer.style.position = 'fixed';
    previewContainer.style.top = '50%';
    previewContainer.style.left = '50%';
    previewContainer.style.transform = 'translate(-50%, -50%)';
    previewContainer.style.zIndex = '9999';
    previewContainer.style.backgroundColor = 'white';
    previewContainer.style.padding = '20px';
    previewContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
    previewContainer.style.maxHeight = '90vh';
    previewContainer.style.overflow = 'auto';

    // Botón de cerrar
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cerrar';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
        document.body.removeChild(previewContainer);
    };

    previewContainer.appendChild(closeButton);
    document.body.appendChild(previewContainer);

    const root = createRoot(previewContainer);
    root.render(<Ticket ticketData={ticketData} />);
};
