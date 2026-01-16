import React, {useEffect, useRef} from 'react';
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
    Refresh
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
    const previousProductIdRef = useRef(null);
    const weightCapturedRef = useRef(false);

    // Modo persistente: báscula siempre conectada con polling cada 800ms
    const {
        weight,
        isStable,
        isConnected,
        isLoading,
        connectScale,
    } = useScale({persistent: true, intervalMs: 800});

    // Detectar cambio de producto
    useEffect(() => {
        if (productId && productId !== previousProductIdRef.current) {
            previousProductIdRef.current = productId;
            weightCapturedRef.current = false; // Reset para nuevo producto
        }
    }, [productId]);

    // Capturar peso instantáneamente cuando se selecciona un producto KILOGRAMO
    useEffect(() => {
        // Si es KILOGRAMO, no se ha capturado, conectado, y hay peso > 0, capturar
        if (isKilogram && productId && !weightCapturedRef.current && isConnected && weight > 0) {
            console.log('Peso capturado instantáneamente:', weight);
            onChange(weight.toFixed(3));
            weightCapturedRef.current = true;
        }
    }, [isKilogram, productId, isConnected, weight, onChange]);

    // Función para recapturar peso manualmente (refrescar lectura)
    const handleRefreshWeight = () => {
        if (isConnected && weight > 0) {
            console.log('Peso recapturado manualmente:', weight);
            onChange(weight.toFixed(3));
        } else if (!isConnected) {
            // Si no está conectada, intentar reconectar
            connectScale();
        }
    };

    return (
        <Stack spacing={1}>
            <TextField
                fullWidth
                size="small"
                type="number"
                label={isKilogram ? "Cantidad (kg)" : "Cantidad"}
                value={value ?? ''}
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
                            <Tooltip title={isConnected ? "Recapturar peso" : "Reconectar báscula"}>
                                <IconButton
                                    size="small"
                                    onClick={handleRefreshWeight}
                                    disabled={isLoading}
                                    edge="end"
                                >
                                    <Refresh
                                        fontSize="small"
                                        color={isConnected ? "primary" : "error"}
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
