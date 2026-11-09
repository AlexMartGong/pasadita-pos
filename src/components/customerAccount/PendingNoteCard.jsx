import {Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography} from '@mui/material';
import {ExpandMore, SavingsOutlined} from '@mui/icons-material';
import {PaymentRow} from './PaymentRow.jsx';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';
import {formatMoney} from '../../utils/money.js';
import {formatDate} from '../../utils/formatters.js';

const Figure = ({label, value, sx}) => (
    <Box sx={customerAccountStyles.noteFigure}>
        <Typography sx={customerAccountStyles.sectionLabel}>{label}</Typography>
        <Typography sx={{...customerAccountStyles.amount, ...sx}}>{value}</Typography>
    </Box>
);

// Una nota pendiente del estado de cuenta; al expandirla muestra sus abonos activos.
export const PendingNoteCard = ({note, isAdmin, onPayNote, onPaymentAction}) => {
    const openAction = (type) => (payment) => onPaymentAction({
        type, payment, saleId: note.saleId, noteTotal: note.total, payments: note.payments,
    });

    return (
        <Accordion disableGutters elevation={0} sx={{border: '1px solid', borderColor: 'divider', '&:before': {display: 'none'}}}>
            <AccordionSummary expandIcon={<ExpandMore/>} sx={{'& .MuiAccordionSummary-content': {my: 1.5}}}>
                <Box sx={customerAccountStyles.noteSummary}>
                    <Box sx={{gridColumn: {xs: '1 / -1', md: 'auto'}}}>
                        <Typography sx={{fontWeight: 700}}>
                            Pedido #{note.orderId} · Nota #{note.saleId}
                        </Typography>
                        <Typography variant="caption" sx={{color: 'text.secondary'}}>
                            {formatDate(note.datetime)} · {note.payments.length} abono{note.payments.length === 1 ? '' : 's'}
                        </Typography>
                    </Box>
                    <Figure label="Total" value={formatMoney(note.total)}/>
                    <Figure label="Abonado" value={formatMoney(note.paidAmount)}/>
                    <Figure label="Saldo" value={formatMoney(note.balance)} sx={customerAccountStyles.balanceValue}/>
                </Box>
            </AccordionSummary>
            <AccordionDetails sx={{pt: 0}}>
                {note.payments.length === 0 ? (
                    <Typography variant="body2" sx={{color: 'text.secondary', py: 1}}>
                        Sin abonos registrados.
                    </Typography>
                ) : note.payments.map((payment) => (
                    <PaymentRow
                        key={payment.paymentId}
                        payment={payment}
                        isAdmin={isAdmin}
                        onEdit={openAction('edit')}
                        onCancel={openAction('cancel')}
                        onHistory={openAction('history')}
                    />
                ))}
                {isAdmin && (
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1.5}}>
                        <Button variant="outlined" startIcon={<SavingsOutlined/>} onClick={() => onPayNote(note)}
                                sx={customerAccountStyles.quickButton}>
                            Abonar a esta nota
                        </Button>
                    </Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
};
