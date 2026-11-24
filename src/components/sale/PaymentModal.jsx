import React, {useState} from 'react';
import {
    Alert, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, FormControlLabel, InputLabel, MenuItem, Select, Typography, useMediaQuery, useTheme
} from '@mui/material';
import {AttachMoney, Backspace} from '@mui/icons-material';
import {saleFormStyles} from '../../styles/js/SaleFormStyles';
import {paymentModalStyles as styles} from '../../styles/js/PaymentModalStyles';
import {CASH_PAYMENT_METHOD_ID, paymentMethodLabel} from '../../utils/paymentMethods';
import {fromCents, toCents} from '../../utils/money';

const DENOMINATIONS = [
    {value: 50, label: '$50'},
    {value: 100, label: '$100'},
    {value: 200, label: '$200'},
    {value: 500, label: '$500'},
    {value: 1000, label: '$1,000'},
];

const DIGIT_KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];

const TITLE_ID = 'payment-modal-title';

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
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [localAmount, setLocalAmount] = useState('');
    // pristine: el monto no se ha editado desde que se abrió o se pulsó Exacto; el primer toque lo reemplaza.
    const [pristine, setPristine] = useState(true);
    const [wasOpen, setWasOpen] = useState(false);

    const totalCents = toCents(total);

    // Ajuste de estado durante el render (sin efecto): solo al abrir, para no reiniciar a medio guardar.
    if (open !== wasOpen) {
        setWasOpen(open);
        if (open) {
            setLocalAmount(amountTendered !== '' ? String(amountTendered) : String(fromCents(totalCents)));
            setPristine(true);
        }
    }

    const isCash = paymentMethodId === CASH_PAYMENT_METHOD_ID;
    const methodLabel = paymentMethodLabel(paymentMethodId);

    const tenderedCents = toCents(localAmount);
    const changeCents = tenderedCents - totalCents;
    const isValid = isCash ? tenderedCents > 0 && changeCents >= 0 : totalCents > 0;

    const activeFiscalList = (fiscalList || []).filter((f) => f.active);
    const invoiceInvalid = requiresInvoice && !selectedFiscalId;
    const showSatWarning = requiresInvoice && total > 2000 && paymentMethodId === CASH_PAYMENT_METHOD_ID;
    const saveDisabled = !isValid || isSubmitting || invoiceInvalid;

    const edit = (next) => {
        setLocalAmount(next);
        setPristine(false);
    };

    // Numpad de pesos cerrados: concatena dígitos y reemplaza el cero solitario.
    const handleDigit = (digit) => edit(pristine || localAmount === '0' ? digit : localAmount + digit);

    // Billetes: el primer toque reemplaza el prellenado; los siguientes suman.
    const handleDenomination = (value) =>
        edit(String(pristine ? value : fromCents(tenderedCents + value * 100)));

    const handleExact = () => {
        setLocalAmount(String(fromCents(totalCents)));
        setPristine(true);
    };

    const handleClear = () => edit('');

    // Los centavos solo llegan por Exacto o el prellenado; Borrar los quita completos porque el numpad no los captura.
    const handleBackspace = () =>
        edit(localAmount.includes('.') ? localAmount.split('.')[0] : localAmount.slice(0, -1));

    const handleSave = () => {
        const amount = fromCents(isCash ? tenderedCents : totalCents);
        onAmountTenderedChange(String(amount));
        onSaveSale(amount);
    };

    const invoiceSection = (
        <>
            <FormControlLabel
                control={
                    <Checkbox
                        color="success"
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

            {requiresInvoice && (
                <FormControl
                    fullWidth
                    size="small"
                    color="success"
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
                        onChange={(e) => onSelectedFiscalIdChange(e.target.value || null)}
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
        </>
    );

    return (
        <Dialog
            open={open}
            onClose={(_, reason) => { if (reason !== 'backdropClick' && !isSubmitting) onClose(); }}
            fullScreen={fullScreen}
            maxWidth={isCash ? 'md' : 'sm'}
            fullWidth
            aria-labelledby={TITLE_ID}
            slotProps={{paper: {sx: styles.paper}}}
        >
            <DialogTitle component="div" sx={styles.title}>
                <AttachMoney sx={styles.titleIcon}/>
                <Typography component="h2" id={TITLE_ID} sx={{font: 'inherit'}}>
                    Cobrar venta
                </Typography>
                {methodLabel && <Chip label={methodLabel} variant="outlined" sx={styles.methodChip}/>}
            </DialogTitle>

            <DialogContent sx={saleFormStyles.dialogContent}>
                {isCash ? (
                    <Box sx={styles.cashLayout}>
                        <Box sx={styles.summaryArea}>
                            <Box sx={styles.summaryRow}>
                                <Typography sx={saleFormStyles.sectionLabel}>Total a pagar</Typography>
                                <Typography sx={styles.totalValue}>{formatCurrency(total)}</Typography>
                            </Box>

                            <Box sx={styles.tenderedBox}>
                                <Typography sx={saleFormStyles.sectionLabel}>Recibido</Typography>
                                <Typography aria-live="polite" sx={styles.tenderedValue(pristine && localAmount !== '')}>
                                    {formatCurrency(fromCents(tenderedCents))}
                                </Typography>
                            </Box>

                            <Box sx={styles.changeBox(isValid)}>
                                <Typography sx={styles.changeLabel}>{isValid ? 'Cambio' : 'Faltan'}</Typography>
                                <Typography sx={styles.changeValue}>
                                    {formatCurrency(fromCents(Math.abs(changeCents)))}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={styles.keysArea}>
                            <Box sx={styles.keyGrid}>
                                {DENOMINATIONS.map((denom) => (
                                    <Button
                                        key={denom.value}
                                        variant="outlined"
                                        onClick={() => handleDenomination(denom.value)}
                                        sx={styles.denominationKey}
                                    >
                                        {denom.label}
                                    </Button>
                                ))}
                                <Button variant="outlined" onClick={handleExact} sx={styles.exactKey}>
                                    Exacto
                                </Button>
                            </Box>

                            <Box sx={styles.keyGrid}>
                                {DIGIT_KEYS.map((digit) => (
                                    <Button
                                        key={digit}
                                        variant="outlined"
                                        onClick={() => handleDigit(digit)}
                                        sx={styles.numpadKey}
                                    >
                                        {digit}
                                    </Button>
                                ))}
                                <Button variant="outlined" onClick={handleClear} sx={styles.numpadAuxKey}>
                                    Limpiar
                                </Button>
                                <Button variant="outlined" onClick={() => handleDigit('0')} sx={styles.numpadKey}>
                                    0
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleBackspace}
                                    aria-label="Borrar último dígito"
                                    sx={styles.numpadAuxKey}
                                >
                                    <Backspace/>
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={styles.invoiceArea}>{invoiceSection}</Box>
                    </Box>
                ) : (
                    <Box sx={styles.nonCashLayout}>
                        <Box sx={styles.totalOnly}>
                            <Typography sx={styles.methodLine}>Pago con {methodLabel}</Typography>
                            <Typography sx={saleFormStyles.sectionLabel}>Total a cobrar</Typography>
                            <Typography sx={styles.totalOnlyValue}>{formatCurrency(total)}</Typography>
                        </Box>

                        <Box sx={styles.nonCashInvoice}>{invoiceSection}</Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={saleFormStyles.dialogActions}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    disabled={isSubmitting}
                    sx={saleFormStyles.cartCancelButton}
                >
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                    disabled={saveDisabled}
                    sx={saleFormStyles.primaryAction}
                >
                    {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Guardar Venta')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
