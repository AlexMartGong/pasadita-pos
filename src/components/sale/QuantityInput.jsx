import React, {useEffect} from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    Stack,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Add,
    Scale,
    Check,
    Link as LinkIcon,
    LinkOff,
    Refresh,
    Remove
} from '@mui/icons-material';
import {useScale} from '../../hooks/useScale';
import {toNumber} from '../../utils/formatters';
import {saleFormStyles} from '../../styles/js/SaleFormStyles';

// Ajuste rápido táctil: paso de los botones − / + y chips de incremento según la unidad.
const FRACTIONAL_UNITS = ['KILOGRAMO', 'LITRO'];
const QUICK_ADJUST = {
    fractional: {step: 0.25, increments: [0.25, 0.5, 1, 2]},
    whole: {step: 1, increments: [1, 2, 5, 10]},
};

// Suma `delta` a la cantidad capturada: nunca negativa y con 3 decimales como máximo.
const adjustQuantity = (current, delta) => {
    const next = toNumber(current) + delta;
    return Math.max(0, Math.round((next + Number.EPSILON) * 1000) / 1000);
};

export const QuantityInput = ({
                                  value,
                                  onChange,
                                  unitMeasure,
                                  productId,
                                  disabled = false,
                                  inputRef
                              }) => {
    const isKilogram = unitMeasure === 'KILOGRAMO';
    const usesScale = isKilogram && Boolean(productId);

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

    const {step, increments} = FRACTIONAL_UNITS.includes(unitMeasure)
        ? QUICK_ADJUST.fractional
        : QUICK_ADJUST.whole;

    // Con la báscula conectada el peso leído sobrescribe la cantidad, así que el ajuste manual
    // solo se ofrece para productos sin báscula o cuando está desconectada.
    const showQuickAdjust = !disabled && Boolean(productId) && (!isKilogram || !isConnected);

    const handleAdjust = (delta) => onChange(adjustQuantity(value, delta));

    return (
        <Stack spacing={1.5}>
            <Box sx={saleFormStyles.quantityRow}>
                {showQuickAdjust && (
                    <IconButton
                        onClick={() => handleAdjust(-step)}
                        disabled={toNumber(value) <= 0}
                        aria-label="Disminuir cantidad"
                        sx={saleFormStyles.stepButton}
                    >
                        <Remove/>
                    </IconButton>
                )}

                <TextField
                    fullWidth
                    size="medium"
                    type="number"
                    color="success"
                    label={isKilogram ? "Cantidad (kg)" : "Cantidad"}
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value.replace(',', '.'))}
                    onFocus={(e) => e.target.select()}
                    inputRef={inputRef}
                    disabled={disabled}
                    sx={saleFormStyles.quantityInput}
                    slotProps={{
                        htmlInput: {
                            step: '1',
                            min: '0',
                            inputMode: 'decimal'
                        },
                        input: usesScale ? {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Scale color={isConnected ? "success" : "disabled"} fontSize="medium"/>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title={isConnected ? "Recapturar peso" : "Reconectar báscula"}>
                                        <IconButton
                                            onClick={handleRefreshWeight}
                                            disabled={isLoading}
                                            edge="end"
                                            aria-label={isConnected ? "Recapturar peso" : "Reconectar báscula"}
                                            sx={saleFormStyles.fieldIconButton}
                                        >
                                            <Refresh
                                                fontSize="medium"
                                                color={isConnected ? "success" : "error"}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        } : undefined
                    }}
                />

                {showQuickAdjust && (
                    <IconButton
                        onClick={() => handleAdjust(step)}
                        aria-label="Aumentar cantidad"
                        sx={saleFormStyles.stepButton}
                    >
                        <Add/>
                    </IconButton>
                )}
            </Box>

            {showQuickAdjust && (
                <Box role="group" aria-label="Sumar a la cantidad" sx={saleFormStyles.quickChips}>
                    {increments.map((increment) => (
                        <Chip
                            key={increment}
                            label={`+${increment}`}
                            variant="outlined"
                            onClick={() => handleAdjust(increment)}
                            sx={saleFormStyles.quickChip}
                        />
                    ))}
                </Box>
            )}

            {/* El estado de la báscula solo importa para productos por kilogramo. */}
            {isKilogram && (
                <Box sx={saleFormStyles.scaleStatus}>
                    {isConnected && (
                        <>
                            <Chip
                                icon={isStable ? <Check/> : undefined}
                                label={isStable ? "Estable" : "Inestable"}
                                color={isStable ? "success" : "warning"}
                                size="medium"
                                sx={saleFormStyles.scaleChip}
                            />
                            <Chip
                                label={`${weight.toFixed(3)} kg`}
                                variant="outlined"
                                size="medium"
                                sx={saleFormStyles.scaleChip}
                            />
                        </>
                    )}
                    <Chip
                        icon={isConnected ? <LinkIcon/> : <LinkOff/>}
                        label={isConnected ? "Conectada" : "Desconectada"}
                        color={isConnected ? "success" : "error"}
                        variant={isConnected ? "outlined" : "filled"}
                        size="medium"
                        sx={saleFormStyles.scaleChip}
                    />
                </Box>
            )}
        </Stack>
    );
};
