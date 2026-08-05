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
    } = useScale({persistent: true, intervalMs: 200});

    useEffect(() => {
        if (isKilogram && productId && isConnected && weight > 0) {
            onChange(Math.round(weight * 1000) / 1000);
        }
    }, [isKilogram, productId, isConnected, weight, onChange]);

    const handleRefreshWeight = () => {
        if (isConnected && weight > 0) {
            console.log('Peso recapturado manualmente:', weight);
            onChange(Math.round(weight * 1000) / 1000);
        } else if (!isConnected) {
            connectScale();
        }
    };

    return (
        <Stack spacing={1}>
            <TextField
                fullWidth
                size="medium"
                type="number"
                label={isKilogram ? "Cantidad (kg)" : "Cantidad"}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value.replace(',', '.'))}
                disabled={disabled}
                slotProps={{
                    htmlInput: {
                        step: '1',
                        min: '0'
                    },
                    input: (isKilogram && productId) ? {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Scale color={isConnected ? "primary" : "disabled"} fontSize="medium"/>
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
                                            fontSize="medium"
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
                            size="medium"
                        />
                        <Chip
                            label={`${weight.toFixed(3)} kg`}
                            color="primary"
                            size="medium"
                        />
                    </>
                )}
                <Chip
                    icon={isConnected ? <LinkIcon/> : <LinkOff/>}
                    label={isConnected ? "Conectada" : "Desconectada"}
                    color={isConnected ? "success" : "error"}
                    size="medium"
                />
            </Stack>
        </Stack>
    );
};
