import React from 'react';
import {Avatar, Box, Card, CardActionArea, CardContent, Typography} from '@mui/material';
import {
    categoryColor,
    categoryLabel,
    productInitials,
    saleFormStyles,
    unitLabel
} from '../../styles/js/SaleFormStyles';

const ProductCardComponent = ({product, onSelect, formatCurrency}) => {
    const color = categoryColor(product.category);

    return (
        <Card sx={saleFormStyles.productCard} elevation={0}>
            <CardActionArea
                sx={saleFormStyles.productCardAction}
                onClick={() => onSelect(product)}
            >
                <Avatar
                    variant="square"
                    src={product.imageUrl}
                    sx={{...saleFormStyles.productAvatar, backgroundColor: color}}
                >
                    {productInitials(product.name)}
                </Avatar>

                <CardContent sx={saleFormStyles.productCardContent}>
                    <Typography
                        variant="subtitle2"
                        sx={saleFormStyles.productName}
                        title={product.name}
                    >
                        {product.name}
                    </Typography>

                    <Typography sx={saleFormStyles.productPrice}>
                        {formatCurrency(product.price)}
                        <Box component="span" sx={saleFormStyles.productUnit}>
                            {' '}/ {unitLabel(product.unitMeasure)}
                        </Box>
                    </Typography>

                    <Box sx={saleFormStyles.productMeta}>
                        <Box component="span" sx={{...saleFormStyles.categoryDot, backgroundColor: color}}/>
                        {categoryLabel(product.category)}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export const ProductCard = React.memo(ProductCardComponent);
