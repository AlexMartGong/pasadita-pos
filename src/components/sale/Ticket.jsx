import PropTypes from 'prop-types';
import '../../styles/css/Ticket.css';
import {formatCurrency, formatDate} from '../../utils/formatters';

export const Ticket = ({ticketData}) => {
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
        amountTendered,
        changeDue,
        paid,
        notes,
        saleDetails
    } = ticketData;

    const isPedido = deliveryOrderId !== null && deliveryAddress !== null;

    return (
        <div className="ticket-container" id="ticket-print">
            {/* Header */}
            <div className="ticket-header">
                <div className="ticket-logo">🍉</div>
                <h2>LA PASADITA</h2>
                <span className={`ticket-type-badge ${isPedido ? 'badge-delivery' : 'badge-sale'}`}>
                    {isPedido ? '📦 PEDIDO A DOMICILIO' : '🛒 VENTA EN CAJA'}
                </span>
                {isPedido && (
                    <p className="order-number">Pedido #{deliveryOrderId}</p>
                )}
                <p className="ticket-date">{formatDate(datetime)}</p>
            </div>

            <div className="ticket-divider"></div>

            {/* Info empleado y cliente */}
            <div className="ticket-info-grid">
                <div className="ticket-info-card">
                    <div className="info-card-header">👤 Empleado</div>
                    <p className="info-name">{employeeName}</p>
                    <p className="info-phone">📞 {employeePhone}</p>
                </div>
                <div className="ticket-info-card">
                    <div className="info-card-header">👤 Cliente</div>
                    <p className="info-name">{customerName}</p>
                    <p className="info-phone">📞 {customerPhone}</p>
                </div>
            </div>

            {isPedido && deliveryAddress && (
                <div className="delivery-info">
                    <span className="delivery-icon">📍</span>
                    <div>
                        <strong>Dirección de entrega</strong>
                        <p>{deliveryAddress}</p>
                    </div>
                </div>
            )}

            <div className="ticket-divider"></div>

            {/* Tabla de productos */}
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

            {/* Totales */}
            <div className="ticket-totals">
                <div className="ticket-total-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                    <div className="ticket-total-row ticket-discount">
                        <span>Descuento</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                )}
                <div className="ticket-total-row ticket-final-total">
                    <span>TOTAL</span>
                    <span>{formatCurrency(total)}</span>
                </div>
                {amountTendered != null && (
                    <div className="ticket-total-row">
                        <span>Recibido</span>
                        <span>{formatCurrency(amountTendered)}</span>
                    </div>
                )}
                {changeDue != null && changeDue >= 0 && (
                    <div className="ticket-total-row" style={{fontWeight: 700, color: '#2e7d32'}}>
                        <span>Cambio</span>
                        <span>{formatCurrency(changeDue)}</span>
                    </div>
                )}
            </div>

            <div className="ticket-divider"></div>

            {/* Pago y notas */}
            <div className="ticket-payment-section">
                <div className="ticket-payment-row">
                    <span className="payment-label">💳 Método de pago</span>
                    <span className="payment-value">{paymentMethodName}</span>
                </div>
                <div className="ticket-payment-row">
                    <span className="payment-label">Estado</span>
                    <span className={`payment-status ${paid ? 'status-paid' : 'status-pending'}`}>
                        {paid ? '✓ PAGADO' : '⏳ PENDIENTE'}
                    </span>
                </div>
            </div>

            {notes && notes.trim() !== '' && (
                <div className="ticket-notes">
                    <strong>📝 Notas:</strong>
                    <p>{notes}</p>
                </div>
            )}

            <div className="ticket-divider"></div>

            {/* Footer */}
            <div className="ticket-footer">
                <p className="footer-thanks">¡Gracias por su compra!</p>
                {isPedido && (
                    <p className="delivery-note">🚚 Su pedido será entregado pronto</p>
                )}
                <p className="footer-brand">La Pasadita</p>
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
        amountTendered: PropTypes.number,
        changeDue: PropTypes.number,
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
