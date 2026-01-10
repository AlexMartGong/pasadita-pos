import PropTypes from 'prop-types';
import '../../styles/css/Ticket.css';

export const Ticket = ({ ticketData }) => {
    if (!ticketData) return null;

    const {
        employeeName,
        employeePhone,
        customerName,
        customerPhone,
        deliveryAddress,
        deliveryOrderId,
        paymentMethodName,
        datetime,
        subtotal,
        discountAmount,
        total,
        paid,
        notes,
        saleDetails
    } = ticketData;

    // Formatear fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Formatear moneda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    const isPedido = deliveryOrderId !== null && deliveryAddress !== null;

    return (
        <div className="ticket-container" id="ticket-print">
            <div className="ticket-header">
                <h2>PASADITA POS</h2>
                <p className="ticket-type">{isPedido ? 'PEDIDO A DOMICILIO' : 'VENTA EN CAJA'}</p>
                {isPedido && (
                    <p className="order-number">Pedido #{deliveryOrderId}</p>
                )}
                <p className="ticket-date">{formatDate(datetime)}</p>
            </div>

            <div className="ticket-divider"></div>

            <div className="ticket-section">
                <h3>Empleado</h3>
                <p><strong>{employeeName}</strong></p>
                <p>Tel: {employeePhone}</p>
            </div>

            <div className="ticket-divider"></div>

            <div className="ticket-section">
                <h3>Cliente</h3>
                <p><strong>{customerName}</strong></p>
                <p>Tel: {customerPhone}</p>
                {isPedido && deliveryAddress && (
                    <div className="delivery-info">
                        <p><strong>Dirección de entrega:</strong></p>
                        <p>{deliveryAddress}</p>
                    </div>
                )}
            </div>

            <div className="ticket-divider"></div>

            <div className="ticket-section">
                <h3>Productos</h3>
                <table className="ticket-products">
                    <thead>
                        <tr>
                            <th className="text-left">Producto</th>
                            <th className="text-right">Cant.</th>
                            <th className="text-right">P.Unit</th>
                            <th className="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {saleDetails && saleDetails.map((detail, index) => (
                            <tr key={index}>
                                <td className="text-left">{detail.productName}</td>
                                <td className="text-right">{detail.quantity}</td>
                                <td className="text-right">{formatCurrency(detail.unitPrice)}</td>
                                <td className="text-right">{formatCurrency(detail.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="ticket-divider"></div>

            <div className="ticket-totals">
                <div className="ticket-total-row">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                    <div className="ticket-total-row ticket-discount">
                        <span>Descuento:</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                )}
                <div className="ticket-total-row ticket-final-total">
                    <span><strong>TOTAL:</strong></span>
                    <span><strong>{formatCurrency(total)}</strong></span>
                </div>
            </div>

            <div className="ticket-divider"></div>

            <div className="ticket-section">
                <div className="ticket-payment">
                    <p><strong>Método de pago:</strong> {paymentMethodName}</p>
                    <p><strong>Estado:</strong> {paid ? 'PAGADO' : 'PENDIENTE'}</p>
                </div>
                {notes && notes.trim() !== '' && (
                    <div className="ticket-notes">
                        <p><strong>Notas:</strong></p>
                        <p>{notes}</p>
                    </div>
                )}
            </div>

            <div className="ticket-divider"></div>

            <div className="ticket-footer">
                <p>¡Gracias por su compra!</p>
                {isPedido && (
                    <p className="delivery-note">Su pedido será entregado pronto</p>
                )}
            </div>
        </div>
    );
};

Ticket.propTypes = {
    ticketData: PropTypes.shape({
        id: PropTypes.number,
        employeeName: PropTypes.string,
        employeePhone: PropTypes.string,
        deliveryOrderId: PropTypes.number,
        customerName: PropTypes.string,
        customerPhone: PropTypes.string,
        deliveryAddress: PropTypes.string,
        paymentMethodName: PropTypes.string,
        datetime: PropTypes.string,
        subtotal: PropTypes.number,
        discountAmount: PropTypes.number,
        total: PropTypes.number,
        paid: PropTypes.bool,
        notes: PropTypes.string,
        saleDetails: PropTypes.arrayOf(
            PropTypes.shape({
                productName: PropTypes.string,
                quantity: PropTypes.number,
                unitPrice: PropTypes.number,
                discount: PropTypes.number,
                total: PropTypes.number
            })
        )
    })
};
