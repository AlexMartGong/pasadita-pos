import React from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
} from '@mui/material';
import {CheckCircle, Print} from '@mui/icons-material';

export const PostSaleSummaryModal = ({
                                         open,
                                         onClose,
                                         onPrint,
                                         total,
                                         amountTendered,
                                         changeDue,
                                         formatCurrency,
                                     }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                color: 'white',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
            }}>
                <CheckCircle/>
                Venta Registrada
            </DialogTitle>

            <DialogContent sx={{pt: 3}}>
                {/* Cambio a devolver — protagonista */}
                <Box sx={{
                    textAlign: 'center',
                    p: 3,
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor: '#e8f5e9',
                    border: '2px solid #2e7d32',
                }}>
                    <Typography variant="body1" color="text.secondary">
                        Cambio a devolver
                    </Typography>
                    <Typography variant="h3" sx={{fontWeight: 800, color: '#2e7d32'}}>
                        {formatCurrency(changeDue)}
                    </Typography>
                </Box>

                {/* Total + efectivo recibido — secundarios */}
                <Box sx={{display: 'flex', justifyContent: 'space-between', px: 1}}>
                    <Box sx={{textAlign: 'center'}}>
                        <Typography variant="caption" color="text.secondary">
                            Total de la venta
                        </Typography>
                        <Typography variant="h6" sx={{fontWeight: 700, color: '#283593'}}>
                            {formatCurrency(total)}
                        </Typography>
                    </Box>
                    <Box sx={{textAlign: 'center'}}>
                        <Typography variant="caption" color="text.secondary">
                            Efectivo recibido
                        </Typography>
                        <Typography variant="h6" sx={{fontWeight: 700, color: '#1b5e20'}}>
                            {formatCurrency(amountTendered)}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{px: 3, pb: 2, gap: 1}}>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Cerrar / No Imprimir
                </Button>
                <Button
                    onClick={onPrint}
                    variant="contained"
                    color="success"
                    startIcon={<Print/>}
                    sx={{fontWeight: 600}}
                >
                    Imprimir Ticket
                </Button>
            </DialogActions>
        </Dialog>
    );
};
