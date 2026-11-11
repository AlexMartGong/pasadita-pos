import React, {useState} from 'react';
import {
    Box, Button, Collapse, FormControl, FormHelperText, InputLabel,
    MenuItem, Select, TextField, Typography
} from '@mui/material';
import {Add} from '@mui/icons-material';
import {PAYMENT_METHODS} from '../../utils/paymentMethods.js';
import {saleFormStyles, touchMenuProps} from '../../styles/js/SaleFormStyles';

// Datos de la venta dentro del panel de ticket: cliente, método de pago y nota opcional.
// Compacto a propósito: el alto que no usa se lo lleva el carrito.
export const SaleInfo = ({
                             customers,
                             formData,
                             selectedCustomer,
                             paymentMethodId,
                             notes,
                             errors,
                             onInputChange,
                             onPaymentMethodChange,
                             onNotesChange
                         }) => {
    // La nota se oculta tras "+ Agregar nota": el campo solo aparece mientras se edita o si ya
    // tiene texto. Al limpiar la venta (`notes` vuelve a '') se oculta solo.
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const showNotes = isEditingNotes || Boolean(notes);
    const hasCustomerDiscount = Boolean(selectedCustomer && selectedCustomer.customDiscount > 0);

    return (
        <Box sx={saleFormStyles.panelSection}>
            <Box sx={saleFormStyles.fieldRow}>
                <FormControl
                    size="small"
                    color="success"
                    error={Boolean(errors.customerId)}
                    sx={{...saleFormStyles.touchField, ...saleFormStyles.customerField}}
                >
                    <InputLabel id="customer-select-label">Cliente</InputLabel>
                    <Select
                        labelId="customer-select-label"
                        id="customer-select"
                        variant="outlined"
                        label="Cliente"
                        value={formData.customerId || ''}
                        onChange={onInputChange('customerId')}
                        MenuProps={touchMenuProps}
                    >
                        <MenuItem value="">
                            <em>Seleccione un cliente</em>
                        </MenuItem>
                        {customers.map((customer) => (
                            <MenuItem key={customer.id} value={customer.id}>
                                {customer.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.customerId && (
                        <FormHelperText>{errors.customerId}</FormHelperText>
                    )}
                </FormControl>

                <FormControl
                    size="small"
                    color="success"
                    sx={{...saleFormStyles.touchField, ...saleFormStyles.paymentField}}
                >
                    <InputLabel id="payment-method-label">Método de pago</InputLabel>
                    <Select
                        labelId="payment-method-label"
                        id="payment-method-select"
                        variant="outlined"
                        label="Método de pago"
                        value={paymentMethodId}
                        onChange={(e) => onPaymentMethodChange(parseInt(e.target.value))}
                        MenuProps={touchMenuProps}
                    >
                        {PAYMENT_METHODS.map((method) => (
                            <MenuItem key={method.value} value={method.value}>
                                {method.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {(hasCustomerDiscount || !showNotes) && (
                <Box sx={saleFormStyles.saleInfoMeta}>
                    {hasCustomerDiscount && (
                        <Typography variant="body2" sx={saleFormStyles.customerDiscount}>
                            <strong>Descuento:</strong> {selectedCustomer.customDiscount}
                        </Typography>
                    )}
                    {!showNotes && (
                        <Button
                            size="small"
                            color="success"
                            startIcon={<Add/>}
                            onClick={() => setIsEditingNotes(true)}
                            sx={saleFormStyles.noteButton}
                        >
                            Agregar nota
                        </Button>
                    )}
                </Box>
            )}

            <Collapse in={showNotes} unmountOnExit>
                <TextField
                    fullWidth
                    size="small"
                    color="success"
                    label="Notas (opcional)"
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    onFocus={() => setIsEditingNotes(true)}
                    onBlur={() => setIsEditingNotes(false)}
                    autoFocus={isEditingNotes}
                    multiline
                    minRows={1}
                    maxRows={2}
                    sx={saleFormStyles.notesField}
                />
            </Collapse>
        </Box>
    );
};
