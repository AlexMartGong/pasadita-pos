import React, {useEffect} from 'react';
import {
    TextField,
    InputAdornment,
    Stack,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Scale,
    Check,
    Link as LinkIcon,
    LinkOff,
    PowerSettingsNew
} from '@mui/icons-material';
import {useScale} from '../../hooks/useScale';

export const QuantityInput = ({
    value,
    onChange,
    unitMeasure,
    productId,
    disabled = false
}) => {
    const isKilogram = unitMeasure === 'KILOGRAMO';

    const {
        weight,
        isStable,
        isConnected,
        isLoading,
        connectScale,
        disconnectScale,
    } = useScale(isKilogram && productId, 500);

    // Conectar automáticamente la báscula cuando el producto sea KILOGRAMO
    useEffect(() => {
        if (isKilogram && productId && !isConnected) {
            connectScale();
        }
    }, [isKilogram, productId, isConnected, connectScale]);

    // Actualizar el campo de cantidad automáticamente cuando el peso es estable
    useEffect(() => {
        if (isKilogram && isConnected && isStable && weight > 0) {
            onChange(weight.toFixed(3));
        }
    }, [isKilogram, isConnected, isStable, weight, onChange]);

    return (
        <Stack spacing={1}>
            <TextField
                fullWidth
                size="small"
                type="number"
                label={isKilogram ? "Cantidad (kg)" : "Cantidad"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                inputProps={{
                    step: isKilogram ? '0.001' : '1',
                    min: '0'
                }}
                InputProps={isKilogram && productId ? {
                    startAdornment: (
                        <InputAdornment position="start">
                            <Scale color={isConnected ? "primary" : "disabled"} fontSize="small"/>
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <Tooltip title={isConnected ? "Desconectar báscula" : "Conectar báscula"}>
                                <IconButton
                                    size="small"
                                    onClick={isConnected ? disconnectScale : connectScale}
                                    disabled={isLoading}
                                    edge="end"
                                >
                                    <PowerSettingsNew
                                        fontSize="small"
                                        color={isConnected ? "error" : "primary"}
                                    />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    )
                } : undefined}
            />
            {isKilogram && productId && (
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Chip
                        icon={isConnected ? <LinkIcon/> : <LinkOff/>}
                        label={isConnected ? "Conectada" : "Desconectada"}
                        color={isConnected ? "success" : "error"}
                        size="small"
                    />
                    {isConnected && (
                        <Chip
                            icon={isStable ? <Check/> : undefined}
                            label={isStable ? "Estable" : "Inestable"}
                            color={isStable ? "success" : "warning"}
                            size="small"
                        />
                    )}
                </Stack>
            )}
        </Stack>
    );
};
