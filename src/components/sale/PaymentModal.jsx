import React, {useState, useEffect} from 'react';
import {
    Alert, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, Grid, InputLabel,
    MenuItem, Select, Typography
} from '@mui/material';
import {AttachMoney, Backspace, RestartAlt} from '@mui/icons-material';

const DENOMINATIONS = [
    {value: 50, label: '$50', color: '#e65100'},
    {value: 100, label: '$100', color: '#c62828'},
    {value: 200, label: '$200', color: '#2e7d32'},
    {value: 500, label: '$500', color: '#4527a0'},
    {value: 1000, label: '$1,000', color: '#0d47a1'},
];

const QUICK_AMOUNTS = [
    {value: 20, label: '$20'},
    {value: 10, label: '$10'},
    {value: 5, label: '$5'},
    {value: 2, label: '$2'},
    {value: 1, label: '$1'},
];

// Estilo compartido de "moneda": chip circular/ovalado táctil.
const coinChipSx = {
    width: 56,
    height: 56,
    borderRadius: '50%',
    border: '2px solid #b08d57',
    backgroundColor: '#fff8e1',
    color: '#8d6e63',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    '& .MuiChip-label': {px: 0},
    '&:hover': {backgroundColor: '#ffecb3'},
};

const NUMPAD_KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', '.'];

// Estilo compartido de tecla del numpad: grande y táctil. Vía prop sx (sin CSS file).
const numpadKeySx = {
    py: 2,
    fontSize: '1.5rem',
    fontWeight: 700,
    borderRadius: 2,
    color: '#283593',
    borderColor: 'rgba(40, 53, 147, 0.3)',
    '&:hover': {
        borderColor: '#283593',
        backgroundColor: '#e8eaf6',
    },
};

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
                                 paymentMethodId,
                                 requiresInvoice,
                                 onRequiresInvoiceChange,
                                 selectedFiscalId,
                                 onSelectedFiscalIdChange,
                                 fiscalList,
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

    const activeFiscalList = (fiscalList || []).filter((f) => f.active);
    const invoiceInvalid = requiresInvoice && !selectedFiscalId;
    const showSatWarning =
        requiresInvoice && total > 2000 && paymentMethodId === 1;
    const saveDisabled = !isValid || isSubmitting || invoiceInvalid;

    // Numpad: concatena caracteres como string (calculadora).
    const handleNumpadPress = (key) => {
        setLocalAmount((prev) => {
            if (key === '.') {
                if (prev.includes('.')) return prev;          // un solo punto decimal
                return prev === '' ? '0.' : prev + '.';
            }
            if (prev === '0') return key === '00' ? '0' : key; // reemplaza cero solitario
            return prev + key;
        });
    };

    // Billetes/monedas: suma matemática sobre el valor actual.
    const handleDenominationClick = (value) => {
        setLocalAmount(String(Math.round((parsedAmount + value) * 100) / 100));
    };

    const handleExactAmount = () => {
        setLocalAmount(String(total));
    };

    const handleReset = () => {
        setLocalAmount('');
    };

    const handleBackspace = () => {
        setLocalAmount((prev) => prev.slice(0, -1));
    };

    const handleSave = () => {
        onAmountTenderedChange(localAmount);
        onSaveSale(parseFloat(localAmount));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                <Grid container spacing={2} sx={{mt: 3}}>
                    {/* ── Columna izquierda: numpad + billetes ─────────────── */}
                    <Grid size={{xs: 12, md: 7}}>
                        {/* Numpad */}
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 1,
                            mb: 1
                        }}>
                            {NUMPAD_KEYS.map((key) => (
                                <Button
                                    key={key}
                                    variant="outlined"
                                    onClick={() => handleNumpadPress(key)}
                                    sx={numpadKeySx}
                                >
                                    {key}
                                </Button>
                            ))}
                        </Box>

                        {/* Borrar (Backspace) */}
                        <Button
                            fullWidth
                            variant="outlined"
                            color="inherit"
                            startIcon={<Backspace/>}
                            onClick={handleBackspace}
                            sx={{
                                py: 1.5,
                                mb: 2,
                                fontWeight: 600,
                                borderRadius: 2,
                                color: '#757575',
                                borderColor: 'rgba(0,0,0,0.23)',
                            }}
                        >
                            Borrar
                        </Button>

                        {/* Billetes */}
                        <Typography variant="subtitle2" color="text.secondary" sx={{mb: 1}}>
                            Billetes
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 1.5,
                            mb: 2
                        }}>
                            {DENOMINATIONS.map((denom) => (
                                <Button
                                    key={denom.value}
                                    variant="contained"
                                    onClick={() => handleDenominationClick(denom.value)}
                                    sx={{
                                        flexBasis: 'calc(33.333% - 12px)',
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

                        {/* Monedas + Exacto + Limpiar */}
                        <Typography variant="subtitle2" color="text.secondary" sx={{mb: 1}}>
                            Monedas
                        </Typography>
                        <Box sx={{display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
                            {QUICK_AMOUNTS.map((item) => (
                                <Chip
                                    key={item.value}
                                    label={item.label}
                                    onClick={() => handleDenominationClick(item.value)}
                                    variant="outlined"
                                    sx={coinChipSx}
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
                    </Grid>

                    {/* ── Columna derecha: resumen + facturación ───────────── */}
                    <Grid size={{xs: 12, md: 5}}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            height: '100%',
                        }}>
                            {/* Total a pagar */}
                            <Box sx={{
                                textAlign: 'center',
                                p: 2,
                                backgroundColor: '#f5f5f5',
                                borderRadius: 2,
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    Total a pagar
                                </Typography>
                                <Typography variant="h4" sx={{fontWeight: 700, color: '#283593'}}>
                                    {formatCurrency(total)}
                                </Typography>
                            </Box>

                            {/* Cantidad recibida (en tiempo real) */}
                            <Box sx={{
                                textAlign: 'center',
                                p: 2,
                                backgroundColor: '#f5f5f5',
                                borderRadius: 2,
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    Cantidad recibida
                                </Typography>
                                <Typography variant="h4" sx={{fontWeight: 700, color: '#1b5e20'}}>
                                    {formatCurrency(parsedAmount)}
                                </Typography>
                            </Box>

                            {/* Cambio */}
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
                                    {isValid
                                        ? formatCurrency(changeDue)
                                        : `Faltan ${formatCurrency(Math.abs(changeDue))}`}
                                </Typography>
                            </Box>

                            <Divider sx={{my: 0.5}}/>

                            {/* Facturación + impresión */}
                            <Box>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!!requiresInvoice}
                                                onChange={(e) => {
                                                    onRequiresInvoiceChange(e.target.checked);
                                                    if (!e.target.checked) {
                                                        onSelectedFiscalIdChange(null);
                                                    }
                                                }}
                                            />
                                        }
                                        label="Requiere Factura"
                                    />
                                </FormGroup>

                                {requiresInvoice && (
                                    <FormControl
                                        fullWidth
                                        size="small"
                                        required
                                        error={!selectedFiscalId}
                                        sx={{mt: 1}}
                                    >
                                        <InputLabel id="fiscal-data-label">Datos Fiscales</InputLabel>
                                        <Select
                                            labelId="fiscal-data-label"
                                            label="Datos Fiscales"
                                            value={selectedFiscalId ?? ''}
                                            variant="outlined"
                                            onChange={(e) =>
                                                onSelectedFiscalIdChange(e.target.value || null)
                                            }
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
                                )}

                                {showSatWarning && (
                                    <Alert severity="warning" sx={{mt: 1.5}}>
                                        Atención: El SAT no permite deducir impuestos de facturas
                                        mayores a $2,000 MXN pagadas en efectivo. Considere sugerir
                                        otro método de pago.
                                    </Alert>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 2}}>
                <Button onClick={onClose} variant="outlined">
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                    disabled={saveDisabled}
                    sx={{fontWeight: 600}}
                >
                    {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Guardar Venta')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
