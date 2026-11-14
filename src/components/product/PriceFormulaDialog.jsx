import {useId, useRef} from 'react';
import {
    Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton,
    InputAdornment, TextField, Typography, useMediaQuery, useTheme
} from '@mui/material';
import {
    Add, LinkOff, PushPin, Remove, Scale, Sync, TrendingDown, TrendingFlat, TrendingUp
} from '@mui/icons-material';
import {usePriceFormulaForm} from '../../hooks/product/usePriceFormulaForm.js';
import {formatCurrency, toNumber} from '../../utils/formatters.js';
import {formatMoney, toCents} from '../../utils/money.js';
import {categoryColor, categoryLabel, productInitials, saleFormStyles} from '../../styles/js/SaleFormStyles.js';
import {priceFormulaStyles as styles} from '../../styles/js/PriceFormulaStyles.js';

const FORMULA_INPUT_SELECTOR = '[data-formula-input="true"]';
const FREIGHT_STEP = 5;
const SHRINKAGE_STEP = 0.5;
const EMPTY = '—';

// Precios: sin decimales cuando son pesos cerrados ($68), con centavos si los traen ($65.50).
const formatPrice = (value) => (Number.isInteger(value) ? formatCurrency(value) : formatMoney(toCents(value)));
const formatCents = (value) => formatMoney(toCents(value));

// Campo de captura: etiqueta fija arriba, texto con teclado decimal (acepta coma) y, si se pide,
// botones − / + de ajuste rápido. `children` va a la derecha del campo (p. ej. "Tomar peso").
const FormulaField = ({
                          id, label, unit, value, onChange, error, helperText, autoFocus = false, disabled = false,
                          stepLabel, onStep, children,
                      }) => {
    const note = error || helperText;
    const noteId = `${id}-note`;

    return (
        <Box>
            <Typography component="label" htmlFor={id} sx={styles.fieldLabel}>{label}</Typography>
            <Box sx={styles.fieldRow}>
                {onStep && (
                    <IconButton
                        onClick={() => onStep(-1)}
                        disabled={disabled || toNumber(value) <= 0}
                        aria-label={`Disminuir ${stepLabel}`}
                        sx={saleFormStyles.stepButton}
                    >
                        <Remove/>
                    </IconButton>
                )}
                <TextField
                    id={id}
                    color="success"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onFocus={(event) => event.target.select()}
                    error={Boolean(error)}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    sx={styles.input}
                    slotProps={{
                        input: unit === '$'
                            ? {startAdornment: <InputAdornment position="start">$</InputAdornment>}
                            : {endAdornment: <InputAdornment position="end">{unit}</InputAdornment>},
                        htmlInput: {
                            inputMode: 'decimal',
                            autoComplete: 'off',
                            'data-formula-input': 'true',
                            'aria-describedby': note ? noteId : undefined,
                        },
                    }}
                />
                {onStep && (
                    <IconButton
                        onClick={() => onStep(1)}
                        disabled={disabled}
                        aria-label={`Aumentar ${stepLabel}`}
                        sx={saleFormStyles.stepButton}
                    >
                        <Add/>
                    </IconButton>
                )}
                {children}
            </Box>
            {note && (
                <Typography id={noteId} role={error ? 'alert' : undefined} sx={styles.helper(Boolean(error))}>
                    {note}
                </Typography>
            )}
        </Box>
    );
};

/**
 * Diálogo "Calcular precio": precio por kilo a partir del costo de la caja (src/utils/priceFormula.js),
 * con el peso de la báscula cuando está disponible. Se monta solo mientras está abierto.
 * `onSave(price)` debe regresar true si se guardó: solo entonces se cierra.
 */
export const PriceFormulaDialog = ({product, onSave, onClose}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const baseId = useId();
    const contentRef = useRef(null);
    const {
        fields, numbers, errors, breakdown, priceDiff, pinned, saving, autoFocusField, scale,
        setField, stepField, takeWeight, submit,
    } = usePriceFormulaForm({product, onSave, onClose});

    const color = categoryColor(product.category);
    const {valid} = breakdown;

    // Enter avanza al siguiente campo; en el último equivale a "Usar este precio".
    const handleKeyDown = (event) => {
        if (event.key !== 'Enter' || !event.target.matches(FORMULA_INPUT_SELECTOR)) return;
        event.preventDefault();
        const inputs = Array.from(contentRef.current.querySelectorAll(FORMULA_INPUT_SELECTOR));
        const next = inputs[inputs.indexOf(event.target) + 1];
        if (next) {
            next.focus();
        } else {
            submit();
        }
    };

    const fieldProps = (key) => ({
        id: `${baseId}-${key}`,
        value: fields[key],
        onChange: (text) => setField(key, text),
        error: errors[key],
        autoFocus: autoFocusField === key,
        disabled: saving,
    });

    const TrendIcon = priceDiff > 0 ? TrendingUp : priceDiff < 0 ? TrendingDown : TrendingFlat;
    const trendText = priceDiff > 0
        ? `sube ${formatPrice(priceDiff)}`
        : priceDiff < 0 ? `baja ${formatPrice(-priceDiff)}` : 'sin cambio';

    return (
        <Dialog
            open
            onClose={saving ? undefined : onClose}
            fullScreen={fullScreen}
            maxWidth="md"
            fullWidth
            aria-labelledby={`${baseId}-title`}
            slotProps={{paper: {sx: styles.paper}}}
        >
            <DialogTitle component="div" sx={styles.title}>
                <Avatar src={product.imageUrl} variant="rounded" sx={{...styles.titleAvatar, backgroundColor: color}}>
                    {productInitials(product.name)}
                </Avatar>
                <Box sx={{minWidth: 0}}>
                    <Typography component="h2" id={`${baseId}-title`} sx={styles.titleText} title={product.name}>
                        Calcular precio · {product.name}
                    </Typography>
                    <Box sx={styles.titleMeta}>
                        <Box component="span" sx={{...saleFormStyles.categoryDot, backgroundColor: color}}/>
                        {categoryLabel(product.category)} · por kg
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent ref={contentRef} onKeyDown={handleKeyDown} sx={styles.content}>
                <Grid container spacing={{xs: 2.5, md: 3}}>
                    <Grid size={{xs: 12, md: 7}}>
                        <Box sx={styles.groups}>
                            <Box sx={styles.group}>
                                <Typography sx={styles.groupLabel}>1 · Lo que pagaste</Typography>
                                <Box sx={styles.pairRow}>
                                    <FormulaField
                                        {...fieldProps('boxCost')}
                                        label="¿Cuánto costó la caja?"
                                        unit="$"
                                    />
                                    <FormulaField
                                        {...fieldProps('freight')}
                                        label="Flete por caja"
                                        unit="$"
                                        helperText="Lo que le toca a cada caja, no el viaje completo"
                                        stepLabel="flete"
                                        onStep={(direction) => stepField('freight', direction * FREIGHT_STEP)}
                                    />
                                </Box>
                            </Box>

                            <Box sx={styles.group}>
                                <Typography sx={styles.groupLabel}>2 · Lo que rinde</Typography>
                                <Box>
                                    <FormulaField
                                        {...fieldProps('boxKilos')}
                                        label="¿Cuántos kilos trae la caja?"
                                        unit="kg"
                                    >
                                        {scale.isConnected && (
                                            <Button
                                                variant="outlined"
                                                color="success"
                                                startIcon={<Scale/>}
                                                onClick={takeWeight}
                                                disabled={saving || scale.liveWeight === null}
                                                sx={styles.takeWeightButton}
                                            >
                                                Tomar peso
                                            </Button>
                                        )}
                                    </FormulaField>
                                    <Box sx={styles.scaleStatus}>
                                        {scale.isConnected ? (
                                            <>
                                                <Chip
                                                    icon={<Scale/>}
                                                    variant="outlined"
                                                    label={scale.liveWeight !== null
                                                        ? `Báscula: ${scale.liveWeight.toFixed(3)} kg`
                                                        : 'Báscula: sin peso'}
                                                    sx={styles.scaleChip}
                                                />
                                                <Chip
                                                    icon={pinned ? <PushPin/> : <Sync/>}
                                                    variant="outlined"
                                                    color={pinned ? 'default' : 'success'}
                                                    label={pinned ? 'Peso fijado' : 'Automático'}
                                                    sx={styles.scaleChip}
                                                />
                                            </>
                                        ) : (
                                            <Chip
                                                icon={<LinkOff/>}
                                                variant="outlined"
                                                color="error"
                                                label={scale.isLoading
                                                    ? 'Conectando báscula…'
                                                    : 'Báscula desconectada · Reconectar'}
                                                onClick={scale.reconnect}
                                                disabled={scale.isLoading}
                                                sx={styles.reconnectChip}
                                            />
                                        )}
                                    </Box>
                                </Box>
                                <FormulaField
                                    {...fieldProps('shrinkage')}
                                    label="¿Cuántos kilos se pierden? (merma)"
                                    unit="kg"
                                    helperText="Incluye el peso del envase"
                                    stepLabel="merma"
                                    onStep={(direction) => stepField('shrinkage', direction * SHRINKAGE_STEP)}
                                />
                            </Box>

                            <Box sx={styles.group}>
                                <Typography sx={styles.groupLabel}>3 · Gastos</Typography>
                                <FormulaField
                                    {...fieldProps('extraPerKilo')}
                                    label="Gastos extra por kilo"
                                    unit="$"
                                />
                            </Box>
                        </Box>
                    </Grid>

                    <Grid size={{xs: 12, md: 5}}>
                        <Box sx={styles.result} aria-live="polite">
                            <Box sx={styles.suggested}>
                                <Typography sx={styles.suggestedLabel}>Precio sugerido</Typography>
                                <Typography component="p" sx={styles.suggestedValue(valid)}>
                                    {valid ? formatCurrency(breakdown.price) : EMPTY}
                                </Typography>
                                <Typography sx={styles.suggestedUnit}>por kg</Typography>
                            </Box>

                            <Box sx={styles.comparison(valid && priceDiff < 0)}>
                                {valid && <TrendIcon fontSize="small"/>}
                                <span>
                                    Precio actual: {formatPrice(toNumber(product.price))}
                                    {valid && ` · ${trendText}`}
                                </span>
                            </Box>

                            <Box component="dl" sx={styles.breakdown}>
                                <Box sx={styles.breakdownRow}>
                                    <Box component="dt" sx={styles.breakdownLabel}>
                                        Kilos que sí se venden
                                        {valid && (
                                            <Box component="span" sx={styles.breakdownNote}>
                                                se pierde el {breakdown.shrinkPct} %
                                            </Box>
                                        )}
                                    </Box>
                                    <Box component="dd" sx={styles.breakdownValue}>
                                        {valid ? `${breakdown.usableKilos.toFixed(3)} kg` : EMPTY}
                                    </Box>
                                </Box>
                                <Box sx={styles.breakdownRow}>
                                    <Box component="dt" sx={styles.breakdownLabel}>Costo por kilo</Box>
                                    <Box component="dd" sx={styles.breakdownValue}>
                                        {valid ? formatCents(breakdown.costPerKilo) : EMPTY}
                                    </Box>
                                </Box>
                                <Box sx={styles.breakdownRow}>
                                    <Box component="dt" sx={styles.breakdownLabel}>Gastos extra</Box>
                                    <Box component="dd" sx={styles.breakdownValue}>
                                        {valid ? `+${formatCents(numbers.extraPerKilo)}` : EMPTY}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={styles.actions}>
                <Button onClick={onClose} disabled={saving} color="inherit" sx={styles.cancelButton}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={submit}
                    disabled={!valid || saving}
                    sx={styles.submitButton}
                >
                    {saving ? 'Guardando…' : 'Usar este precio'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
