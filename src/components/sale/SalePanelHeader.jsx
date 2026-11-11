import React from 'react';
import {Box, Chip, IconButton, Tooltip} from '@mui/material';
import {Person, PointOfSale} from '@mui/icons-material';
import {saleFormStyles} from '../../styles/js/SaleFormStyles';

// Barra superior del panel de ticket: sesión activa, hueco central para el selector de tipo de
// operación (`children`; solo lo renderiza ROLE_ADMIN) y "Abrir Caja" (ADMIN/CAJERO).
export const SalePanelHeader = ({user, canOpenDrawer, onOpenDrawer, children}) => {
    return (
        <Box sx={saleFormStyles.panelHeader}>
            <Chip
                icon={<Person fontSize="small"/>}
                label={user || ''}
                variant="outlined"
                sx={saleFormStyles.userChip}
            />

            <Box sx={saleFormStyles.panelHeaderSlot}>
                {children}
            </Box>

            {canOpenDrawer && (
                <Tooltip title="Abrir Caja">
                    <IconButton
                        onClick={onOpenDrawer}
                        aria-label="Abrir caja"
                        sx={saleFormStyles.drawerButton}
                    >
                        <PointOfSale/>
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    );
};
