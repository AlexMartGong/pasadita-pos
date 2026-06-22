import React, {useEffect, useState} from 'react';
import {Avatar, Box, Button, Card, CardContent, Chip, TextField, Typography} from '@mui/material';
import {Check as CheckIcon, Save as SaveIcon} from '@mui/icons-material';
import {categoryColor, categoryLabel, productInitials} from '../../styles/js/SaleFormStyles';
import {quickPricesStyles} from '../../styles/js/QuickPricesStyles';

const ProductPriceCardComponent = ({product, onSave}) => {
    const color = categoryColor(product.category);
    const [draft, setDraft] = useState(String(product.price));
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Resincroniza el borrador cuando el precio guardado cambia (tras un guardado exitoso
    // el slice actualiza product.price y el botón vuelve a quedar deshabilitado).
    useEffect(() => {
        setDraft(String(product.price));
    }, [product.price]);

    const changed = parseFloat(draft) !== product.price;

    const commit = async () => {
        if (!changed || saving) return;
        setSaving(true);
        const ok = await onSave(product.id, draft);
        setSaving(false);
        if (ok) {
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
        }
    };

    return (
        <Card sx={quickPricesStyles.card} elevation={1}>
            <CardContent sx={quickPricesStyles.cardContent}>
                <Box sx={quickPricesStyles.cardHeader}>
                    <Avatar src={product.imageUrl} sx={{...quickPricesStyles.avatar, backgroundColor: color}}>
                        {productInitials(product.name)}
                    </Avatar>
                    <Box sx={{minWidth: 0}}>
                        <Typography variant="subtitle2" sx={quickPricesStyles.name} title={product.name} noWrap>
                            {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ID: {product.id}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={quickPricesStyles.metaRow}>
                    <Chip
                        size="small"
                        label={categoryLabel(product.category)}
                        sx={{...quickPricesStyles.categoryChip, backgroundColor: color}}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {product.unitMeasure}
                    </Typography>
                </Box>

                <Box sx={quickPricesStyles.priceRow}>
                    <TextField
                        label="Precio"
                        type="number"
                        size="small"
                        fullWidth
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={commit}
                        disabled={saving}
                        sx={quickPricesStyles.priceInput}
                        slotProps={{
                            htmlInput: {
                                inputMode: 'decimal',
                                min: 0,
                                step: '0.01',
                                'aria-label': `Precio de ${product.name}`,
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        color={saved ? 'success' : 'primary'}
                        onClick={commit}
                        disabled={!changed || saving}
                        sx={quickPricesStyles.saveButton}
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
