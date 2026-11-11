import React from 'react';
import {ToggleButton, ToggleButtonGroup} from '@mui/material';
import {LocalShipping, Storefront} from '@mui/icons-material';
import {saleFormStyles} from '../../styles/js/SaleFormStyles';

// Selector de tipo de operación. Regla de autorización: solo administradores
// (ROLE_ADMIN) pueden ver/cambiar este control; para el resto no se renderiza.
// Vive dentro de la barra superior del panel de ticket (SalePanelHeader).
export const OperationTypeToggle = ({operationType, onChange, isAdmin}) => {
    if (!isAdmin) return null;

    const handleChange = (_event, value) => {
        // ToggleButtonGroup exclusivo: ignorar la deselección (value === null).
        if (value !== null) {
            onChange(value);
        }
    };

    return (
        <ToggleButtonGroup
            value={operationType}
            exclusive
            size="small"
            onChange={handleChange}
            aria-label="Tipo de operación"
            sx={saleFormStyles.operationToggleGroup}
        >
            <ToggleButton
                value="venta"
                aria-label="Venta en caja"
                sx={saleFormStyles.operationToggleButton('venta')}
            >
                <Storefront fontSize="small"/>
                Caja
            </ToggleButton>
            <ToggleButton
                value="pedido"
                aria-label="Pedido a domicilio"
                sx={saleFormStyles.operationToggleButton('pedido')}
            >
                <LocalShipping fontSize="small"/>
                Domicilio
            </ToggleButton>
        </ToggleButtonGroup>
    );
};
