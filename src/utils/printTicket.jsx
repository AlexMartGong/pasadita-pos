import { createRoot } from 'react-dom/client';
import { Ticket } from '../components/sale/Ticket';

export const printTicket = async (ticketData) => {
    if (!ticketData) {
        console.error('No hay datos del ticket para imprimir');
        return;
    }

    const printContainer = document.createElement('div');
    printContainer.id = 'print-ticket-container';
    printContainer.style.position = 'absolute';
    printContainer.style.top = '0';
    printContainer.style.left = '-9999px';
    printContainer.style.width = '80mm';
    printContainer.style.visibility = 'hidden';

    document.body.appendChild(printContainer);

    try {
        const root = createRoot(printContainer);
        root.render(<Ticket ticketData={ticketData} />);

        console.log('Ticket renderizado, datos:', ticketData);
        console.log('Número de productos:', ticketData.saleDetails?.length || 0);

        await new Promise((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTimeout(resolve, 500);
                });
            });
        });

        console.log('Abriendo diálogo de impresión...');

        window.print();

        setTimeout(() => {
            root.unmount();
            if (document.body.contains(printContainer)) {
                document.body.removeChild(printContainer);
            }
        }, 1000);
    } catch (error) {
        console.error('Error al imprimir el ticket:', error);
        console.error('Datos del ticket:', ticketData);
        if (document.body.contains(printContainer)) {
            document.body.removeChild(printContainer);
        }
    }
};

export const previewTicket = (ticketData) => {
    if (!ticketData) {
        console.error('No hay datos del ticket para previsualizar');
        return;
    }

    console.log('Vista previa del ticket:', ticketData);

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
