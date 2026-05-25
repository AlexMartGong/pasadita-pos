import React from 'react';
import {Box, Paper, ToggleButton, ToggleButtonGroup, Typography} from '@mui/material';
import {LocalShipping, Storefront} from '@mui/icons-material';

// Selector de tipo de operación. Regla de autorización: solo administradores
// (ROLE_ADMIN) pueden ver/cambiar este control; para el resto no se renderiza.
export const OperationTypeToggle = ({operationType, onChange, isAdmin}) => {
    if (!isAdmin) return null;

    const handleChange = (_event, value) => {
        // ToggleButtonGroup exclusivo: ignorar la deselección (value === null).
        if (value !== null) {
            onChange(value);
        }
    };

    return (
        <Paper elevation={2} sx={{flexShrink: 0, overflow: 'hidden', border: '1px solid rgba(106, 27, 154, 0.15)'}}>
            <Box sx={{
                background: 'linear-gradient(135deg, #6a1b9a 0%, #ab47bc 100%)',
                px: 2, py: 1.5,
                display: 'flex', alignItems: 'center', gap: 1
            }}>
                <Typography variant="h6" sx={{color: 'white', fontWeight: 600, fontSize: '1rem'}}>
                    Tipo de Operación
                </Typography>
            </Box>

            <Box sx={{p: 2}}>
                <ToggleButtonGroup
                    value={operationType}
                    exclusive
                    fullWidth
                    color="secondary"
                    onChange={handleChange}
                    aria-label="Tipo de operación"
                >
                    <ToggleButton value="venta" aria-label="Venta en caja">
                        <Storefront sx={{mr: 1}}/>
                        Caja
                    </ToggleButton>
                    <ToggleButton value="pedido" aria-label="Pedido a domicilio">
                        <LocalShipping sx={{mr: 1}}/>
                        Domicilio
                    </ToggleButton>
                </ToggleButtonGroup>

                {operationType === 'venta' && (
                    <Typography variant="caption" color="text.secondary" sx={{mt: 1, display: 'block'}}>
                        Modo Venta: No se creará pedido de entrega
                    </Typography>
                )}
                {operationType === 'pedido' && (
                    <Typography variant="caption" sx={{mt: 1, display: 'block', color: '#6a1b9a', fontWeight: 500}}>
                        Modo Pedido: Se creará pedido de entrega
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};
