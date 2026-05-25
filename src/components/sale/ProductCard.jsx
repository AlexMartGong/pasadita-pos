import React from 'react';
import {Avatar, Box, Card, CardActionArea, CardContent, Chip, Typography} from '@mui/material';
import {
    categoryColor,
    categoryLabel,
    productInitials,
    saleFormStyles
} from '../../styles/js/SaleFormStyles';

const ProductCardComponent = ({product, onSelect, formatCurrency}) => {
    const color = categoryColor(product.category);

    return (
        <Card sx={saleFormStyles.productCard} elevation={1}>
            <CardActionArea
                sx={saleFormStyles.productCardAction}
                onClick={() => onSelect(product)}
            >
                <CardContent sx={{width: '100%', textAlign: 'center', p: 1.5}}>
                    <Box sx={{display: 'flex', justifyContent: 'center', mb: 1}}>
                        <Avatar sx={{...saleFormStyles.productAvatar, backgroundColor: color}}>
                            {productInitials(product.name)}
                        </Avatar>
                    </Box>

                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 600,
                            minHeight: '2.4em',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.2,
                        }}
                        title={product.name}
                    >
                        {product.name}
                    </Typography>

                    <Typography variant="h6" sx={{...saleFormStyles.productPrice, mt: 0.5}}>
                        {formatCurrency(product.price)}
                    </Typography>

                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, mt: 1}}>
                        <Chip
                            size="small"
                            label={categoryLabel(product.category)}
                            sx={{
                                backgroundColor: color,
                                color: 'white',
                                fontWeight: 600,
                                height: 20,
                                fontSize: '0.7rem',
                            }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {product.unitMeasure}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export const ProductCard = React.memo(ProductCardComponent);
