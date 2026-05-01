import {useEffect, useState} from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, TextField, Typography
} from '@mui/material';
import {Email} from '@mui/icons-material';
import {useInvoice} from '../../hooks/invoice/useInvoice';
import {useCustomerFiscalData} from '../../hooks/customerFiscalData/useCustomerFiscalData';

export const SendEmailModal = ({open, onClose, invoice}) => {
    const {handleSendInvoiceEmail} = useInvoice();
    const {handleGetFiscalDataById} = useCustomerFiscalData();
    const [emailInput, setEmailInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setEmailInput('');
            return;
        }
        if (!invoice?.fiscalId) return;

        let cancelled = false;
        setIsLoading(true);
        handleGetFiscalDataById(invoice.fiscalId)
            .then((data) => {
                if (cancelled) return;
                setEmailInput(data?.emailFacturacion ?? '');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [open, invoice?.fiscalId]);

    const handleSend = async () => {
        if (!invoice?.saleId || !emailInput) return;
        setIsLoading(true);
        try {
            const ok = await handleSendInvoiceEmail(invoice.saleId, emailInput);
            if (ok) onClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={isLoading ? undefined : onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #283593 0%, #5c6bc0 100%)',
                color: 'white',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <Email/>
                Enviar Factura por Correo
            </DialogTitle>
            <DialogContent sx={{pt: 3}}>
                <DialogContentText sx={{mb: 2, mt: 1}}>
                    {invoice?.uuid
                        ? `Factura UUID ${invoice.uuid}`
                        : `Factura #${invoice?.invoiceId ?? ''}`}
                    {' '}(Venta #{invoice?.saleId ?? ''}). Se enviará el PDF y XML al correo indicado.
                </DialogContentText>
                <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                    Puedes dejar el correo registrado del cliente o escribir uno distinto.
                </Typography>
                <TextField
                    autoFocus
                    fullWidth
                    type="email"
                    label="Correo del destinatario"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    disabled={isLoading}
                />
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 2}}>
                <Button onClick={onClose} variant="outlined" disabled={isLoading}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                    disabled={isLoading || !emailInput}
                    sx={{fontWeight: 600}}
                >
                    {isLoading ? 'Enviando...' : 'Enviar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
