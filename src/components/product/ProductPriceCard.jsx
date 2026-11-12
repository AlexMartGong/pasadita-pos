import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Box, Button, Card, CardContent, InputAdornment, TextField, Typography} from '@mui/material';
import {Check as CheckIcon, Save as SaveIcon} from '@mui/icons-material';
import {
    categoryColor,
    categoryLabel,
    productInitials,
    saleFormStyles,
    unitLabel
} from '../../styles/js/SaleFormStyles';
import {quickPricesStyles} from '../../styles/js/QuickPricesStyles';

const PRICE_INPUT_SELECTOR = '[data-price-input="true"]';
const SAVED_FEEDBACK_MS = 1500;

// Enfoca el input de precio de la siguiente tarjeta en el DOM. Si no hay siguiente (última
// tarjeta de la página) suelta el foco. En ambos casos el blur dispara el guardado.
const focusNextPriceInput = (current) => {
    const inputs = Array.from(document.querySelectorAll(PRICE_INPUT_SELECTOR));
    const next = inputs[inputs.indexOf(current) + 1];
    if (next) {
        next.focus();
    } else {
        current.blur();
    }
};

const ProductPriceCardComponent = ({product, onSave}) => {
    const color = categoryColor(product.category);
    const [draft, setDraft] = useState(String(product.price));
    const [syncedPrice, setSyncedPrice] = useState(product.price);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Guardas síncronas: el estado `saving` no se ve hasta el siguiente render y un blur puede
    // llegar antes; `skipCommit` evita guardar el valor que Escape acaba de descartar.
    const inFlightRef = useRef(false);
    const skipCommitRef = useRef(false);
    const savedTimerRef = useRef(null);

    // Resincroniza el borrador cuando cambia el precio guardado (ajuste durante el render).
    if (syncedPrice !== product.price) {
        setSyncedPrice(product.price);
        setDraft(String(product.price));
    }

    useEffect(() => () => clearTimeout(savedTimerRef.current), []);

    const changed = parseFloat(draft) !== product.price;

    const commit = async () => {
        if (!changed || inFlightRef.current) return;
        inFlightRef.current = true;
        setSaving(true);
        const ok = await onSave(product.id, draft);
        inFlightRef.current = false;
        setSaving(false);
        if (ok) {
            setSaved(true);
            clearTimeout(savedTimerRef.current);
            savedTimerRef.current = setTimeout(() => setSaved(false), SAVED_FEEDBACK_MS);
        }
    };

    const handleBlur = () => {
        if (skipCommitRef.current) {
            skipCommitRef.current = false;
            return;
        }
        commit();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            focusNextPriceInput(e.target);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            skipCommitRef.current = true;
            setDraft(String(product.price));
            e.target.blur();
        }
    };

    return (
        <Card sx={quickPricesStyles.card({changed, saved})} elevation={0}>
            <Avatar
                variant="square"
                src={product.imageUrl}
                sx={{...quickPricesStyles.avatar, backgroundColor: color}}
            >
                {productInitials(product.name)}
            </Avatar>
            <CardContent sx={quickPricesStyles.cardContent}>
                <Typography variant="subtitle2" sx={quickPricesStyles.name} title={product.name} noWrap>
                    {product.name}
                </Typography>

                <Box sx={quickPricesStyles.metaRow}>
                    <Box component="span" sx={quickPricesStyles.metaCategory}>
                        <Box component="span" sx={{...saleFormStyles.categoryDot, backgroundColor: color}}/>
                        {categoryLabel(product.category)} · {unitLabel(product.unitMeasure)}
                    </Box>
                    <Box component="span" sx={quickPricesStyles.metaId}>
                        ID: {product.id}
                    </Box>
                </Box>

                <Box sx={quickPricesStyles.priceRow}>
                    <TextField
                        type="number"
                        color="success"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        disabled={saving}
                        sx={quickPricesStyles.priceInput(changed)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start" sx={quickPricesStyles.currencyAdornment}>
                                        $
                                    </InputAdornment>
                                ),
                            },
                            htmlInput: {
                                inputMode: 'decimal',
                                min: 0,
                                step: '0.01',
                                'aria-label': `Precio de ${product.name}`,
                                'data-price-input': 'true',
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        color="success"
                        onClick={commit}
                        disabled={!changed || saving}
                        sx={quickPricesStyles.saveButton(saved)}
                        aria-label={`Guardar precio de ${product.name}`}
                    >
                        {saved ? <CheckIcon/> : <SaveIcon/>}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export const ProductPriceCard = React.memo(ProductPriceCardComponent);
