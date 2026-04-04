import React, {useState, useEffect} from 'react';
import {
    Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, TextField, Typography
} from '@mui/material';
import {AttachMoney, Backspace, RestartAlt} from '@mui/icons-material';

const DENOMINATIONS = [
    {value: 20, label: '$20', color: '#1565c0'},
    {value: 50, label: '$50', color: '#e65100'},
    {value: 100, label: '$100', color: '#c62828'},
    {value: 200, label: '$200', color: '#2e7d32'},
    {value: 500, label: '$500', color: '#4527a0'},
    {value: 1000, label: '$1,000', color: '#0d47a1'},
];

const QUICK_AMOUNTS = [
    {value: 10, label: '$10'},
    {value: 5, label: '$5'},
    {value: 1, label: '$1'},
];

export const PaymentModal = ({
                                 open,
                                 onClose,
                                 total,
                                 amountTendered,
                                 onAmountTenderedChange,
                                 onSaveSale,
                                 isSubmitting,
                                 isEditMode,
                                 formatCurrency,
                             }) => {
    const [localAmount, setLocalAmount] = useState('');

    useEffect(() => {
        if (open) {
            setLocalAmount(amountTendered !== '' ? String(amountTendered) : '');
        }
    }, [open, amountTendered]);

    const parsedAmount = parseFloat(localAmount) || 0;
    const changeDue = parsedAmount - total;
    const isValid = parsedAmount >= total && parsedAmount > 0;

    const handleDenominationClick = (value) => {
        const newAmount = parsedAmount + value;
        setLocalAmount(String(newAmount));
    };

    const handleExactAmount = () => {
        setLocalAmount(String(total));
    };

    const handleReset = () => {
        setLocalAmount('');
    };

    const handleBackspace = () => {
        setLocalAmount(prev => prev.slice(0, -1));
    };

    const handleSave = () => {
        onAmountTenderedChange(localAmount);
        onSaveSale(parseFloat(localAmount));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                color: 'white',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <AttachMoney/>
                Cobrar Venta
            </DialogTitle>
            <DialogContent sx={{pt: 3}}>
                {/* Total a pagar */}
                <Box sx={{
                    textAlign: 'center',
                    mb: 3,
                    mt: 1,
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2
                }}>
                    <Typography variant="body2" color="text.secondary">
                        Total a pagar
                    </Typography>
                    <Typography variant="h4" sx={{fontWeight: 700, color: '#283593'}}>
                        {formatCurrency(total)}
                    </Typography>
                </Box>

                {/* Cantidad recibida */}
                <Box sx={{mb: 2.5}}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <TextField
                            fullWidth
                            label="Cantidad Recibida"
                            type="number"
                            value={localAmount}
                            onChange={(e) => setLocalAmount(e.target.value)}
                            slotProps={{
                                htmlInput: {
                                    step: '0.01',
                                    min: '0'
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontSize: '1.3rem',
                                    fontWeight: 600
                                }
                            }}
                        />
                        <IconButton onClick={handleBackspace} size="small" sx={{color: '#757575'}}>
                            <Backspace/>
                        </IconButton>
                    </Box>
                </Box>

                {/* Billetes mexicanos */}
                <Typography variant="subtitle2" color="text.secondary" sx={{mb: 1}}>
                    Billetes
                </Typography>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 1.5,
                    mb: 2
                }}>
                    {DENOMINATIONS.map((denom) => (
                        <Button
                            key={denom.value}
                            variant="contained"
                            onClick={() => handleDenominationClick(denom.value)}
                            sx={{
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 700,
                                backgroundColor: denom.color,
                                '&:hover': {
                                    backgroundColor: denom.color,
                                    filter: 'brightness(1.15)',
                                },
                                borderRadius: 2,
                                textTransform: 'none',
                            }}
                        >
                            {denom.label}
                        </Button>
                    ))}
                </Box>

                {/* Monedas / cantidades menores */}
                <Typography variant="subtitle2" color="text.secondary" sx={{mb: 1}}>
                    Monedas
                </Typography>
                <Box sx={{display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap'}}>
                    {QUICK_AMOUNTS.map((item) => (
                        <Chip
                            key={item.value}
                            label={item.label}
                            onClick={() => handleDenominationClick(item.value)}
                            variant="outlined"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                py: 2,
                                cursor: 'pointer',
                                '&:hover': {backgroundColor: '#e8f5e9'},
                            }}
                        />
                    ))}
                    <Chip
                        label="Exacto"
                        icon={<AttachMoney sx={{fontSize: 18}}/>}
                        onClick={handleExactAmount}
                        color="success"
                        variant="outlined"
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            py: 2,
                            cursor: 'pointer',
                        }}
                    />
                    <Chip
                        label="Limpiar"
                        icon={<RestartAlt sx={{fontSize: 18}}/>}
                        onClick={handleReset}
                        color="default"
                        variant="outlined"
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            py: 2,
                            cursor: 'pointer',
                        }}
                    />
                </Box>

                {/* Cambio */}
                {parsedAmount > 0 && (
                    <Box sx={{
                        textAlign: 'center',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: isValid ? '#e8f5e9' : '#ffebee',
                        border: `2px solid ${isValid ? '#2e7d32' : '#c62828'}`,
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            Cambio
                        </Typography>
                        <Typography variant="h4" sx={{
                            fontWeight: 700,
                            color: isValid ? '#2e7d32' : '#c62828',
                        }}>
                            {isValid ? formatCurrency(changeDue) : `Faltan ${formatCurrency(Math.abs(changeDue))}`}
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 2}}>
                <Button onClick={onClose} variant="outlined">
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                    disabled={!isValid || isSubmitting}
                    sx={{fontWeight: 600}}
                >
                    {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Guardar Venta')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
