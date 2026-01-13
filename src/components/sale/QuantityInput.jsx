import React, {useEffect, useRef, useState} from 'react';
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
    const [autoConnected, setAutoConnected] = useState(false);
    const timeoutRef = useRef(null);
    const previousProductIdRef = useRef(null);

    const {
        weight,
        isStable,
        isConnected,
        isLoading,
        connectScale,
        disconnectScale,
    } = useScale(autoConnected, 500); // Hacer polling solo cuando autoConnected es true

    // Conectar automáticamente cuando cambia el producto y es KILOGRAMO
    useEffect(() => {
        const productChanged = productId && productId !== previousProductIdRef.current;
        previousProductIdRef.current = productId;

        if (isKilogram && productId && productChanged && !isConnected) {
            setAutoConnected(true);
            connectScale();

            // Desconectar automáticamente después de 15 segundos
            timeoutRef.current = setTimeout(() => {
                console.log('Auto-disconnect: tiempo límite alcanzado');
                disconnectScale();
                setAutoConnected(false);
            }, 15000);
        }

        // Limpiar timeout cuando se desmonta o cambia el producto
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [isKilogram, productId, isConnected, connectScale, disconnectScale]);

    // Capturar peso automáticamente cuando es estable y desconectar
    useEffect(() => {
        if (isKilogram && isConnected && isStable && weight > 0 && autoConnected) {
            console.log('Peso estable detectado:', weight);
            onChange(weight.toFixed(3));

            // Desconectar después de capturar el peso
            setTimeout(() => {
                console.log('Auto-disconnect: peso capturado');
                disconnectScale();
                setAutoConnected(false);
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
            }, 1000); // Esperar 1 segundo después de capturar para que el usuario vea el peso
        }
    }, [isKilogram, isConnected, isStable, weight, autoConnected, onChange, disconnectScale]);

    // Función para reconectar manualmente
    const handleReconnect = () => {
        if (!isConnected) {
            setAutoConnected(true);
            connectScale();

            // Desconectar automáticamente después de 15 segundos
            timeoutRef.current = setTimeout(() => {
                console.log('Auto-disconnect manual: tiempo límite alcanzado');
                disconnectScale();
                setAutoConnected(false);
            }, 15000);
        } else {
            disconnectScale();
            setAutoConnected(false);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }
    };

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
                            <Tooltip title={isConnected ? "Desconectar báscula" : "Reconectar báscula"}>
                                <IconButton
                                    size="small"
                                    onClick={handleReconnect}
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
                        <>
                            <Chip
                                icon={isStable ? <Check/> : undefined}
                                label={isStable ? "Estable" : "Inestable"}
                                color={isStable ? "success" : "warning"}
                                size="small"
                            />
                            {weight > 0 && (
                                <Chip
                                    label={`${weight.toFixed(3)} kg`}
                                    color="primary"
                                    size="small"
                                />
                            )}
                        </>
                    )}
                </Stack>
            )}
        </Stack>
    );
};
