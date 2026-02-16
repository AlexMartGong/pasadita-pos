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

    const {
        weight,
        isStable,
        isConnected,
        isLoading,
        connectScale,
    } = useScale({persistent: true, intervalMs: 800});

    useEffect(() => {
        if (isKilogram && productId && isConnected && weight > 0) {
            onChange(weight.toFixed(3));
        }
    }, [isKilogram, productId, isConnected, weight, onChange]);

    const handleRefreshWeight = () => {
        if (isConnected && weight > 0) {
            console.log('Peso recapturado manualmente:', weight);
            onChange(weight.toFixed(3));
        } else if (!isConnected) {
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
                slotProps={{
                    htmlInput: {
                        step: '0.1',
                        min: '0'
                    },
                    input: (isKilogram && productId) ? {
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
                    } : undefined
                }}
            />

            <Stack direction="row" spacing={1} justifyContent="flex-end">
                {isConnected && (
                    <>
                        <Chip
                            icon={isStable ? <Check/> : undefined}
                            label={isStable ? "Estable" : "Inestable"}
                            color={isStable ? "success" : "warning"}
                            size="small"
                        />
                        <Chip
                            label={`${weight.toFixed(3)} kg`}
                            color="primary"
                            size="small"
                        />
                    </>
                )}
                <Chip
                    icon={isConnected ? <LinkIcon/> : <LinkOff/>}
                    label={isConnected ? "Conectada" : "Desconectada"}
                    color={isConnected ? "success" : "error"}
                    size="small"
                />
            </Stack>
        </Stack>
    );
};
