import React, {useEffect, useState} from 'react';
import {
    Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, InputLabel, MenuItem, Select, Typography
} from '@mui/material';
import {ReceiptLong} from '@mui/icons-material';
import {useCustomerFiscalData} from '../../hooks/customerFiscalData/useCustomerFiscalData';
import {useInvoice} from '../../hooks/invoice/useInvoice';

export const InvoiceSaleModal = ({open, onClose, saleId}) => {
    const {customerFiscalDataList, handleGetAllFiscalData} = useCustomerFiscalData();
    const {handleTimbrarInvoice, loading} = useInvoice();
    const [selectedFiscalId, setSelectedFiscalId] = useState(null);

    useEffect(() => {
        if (open) {
            handleGetAllFiscalData();
            setSelectedFiscalId(null);
        }
    }, [open]);

    const activeFiscalList = (customerFiscalDataList || []).filter((f) => f.active);

    const handleTimbrar = async () => {
        if (!saleId || !selectedFiscalId) return;
        const result = await handleTimbrarInvoice({saleId, fiscalId: selectedFiscalId});
        if (result) {
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #283593 0%, #5c6bc0 100%)',
                color: 'white',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <ReceiptLong/>
                Generar Factura para Venta # {saleId}
            </DialogTitle>
            <DialogContent sx={{pt: 3}}>
                <Typography variant="body2" color="text.secondary" sx={{mb: 2, mt: 1}}>
                    Selecciona el perfil fiscal del cliente para timbrar la factura CFDI 4.0.
                </Typography>
                <FormControl
                    fullWidth
                    required
                    error={!selectedFiscalId}
                    disabled={loading}
                >
                    <InputLabel id="invoice-fiscal-label">Datos Fiscales</InputLabel>
                    <Select
                        labelId="invoice-fiscal-label"
                        label="Datos Fiscales"
                        value={selectedFiscalId ?? ''}
                        onChange={(e) => setSelectedFiscalId(e.target.value || null)}
                    >
                        {activeFiscalList.length === 0 ? (
                            <MenuItem value="" disabled>
                                Sin perfiles fiscales registrados
                            </MenuItem>
                        ) : (
                            activeFiscalList.map((f) => (
                                <MenuItem key={f.fiscalId} value={f.fiscalId}>
                                    {f.rfc} - {f.razonSocial}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>

                {activeFiscalList.length === 0 && (
                    <Alert severity="info" sx={{mt: 2}}>
                        Registra un perfil fiscal en "Datos Fiscales" antes de timbrar.
                    </Alert>
                )}
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 2}}>
                <Button onClick={onClose} variant="outlined" disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleTimbrar}
                    disabled={loading || !selectedFiscalId}
                    sx={{fontWeight: 600}}
                >
                    {loading ? 'Timbrando...' : 'Timbrar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
