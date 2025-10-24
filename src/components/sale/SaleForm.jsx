import React from 'react';
import {Box, Grid, FormControl, InputLabel, Select, MenuItem, Paper, Typography} from '@mui/material';
import {ProductsTable} from './ProductsTable';
import {SaleInfo} from './SaleInfo';
import {DeliveryOrder} from './DeliveryOrder';
import {AddProductForm} from './AddProductForm';
import {ShoppingCart} from './ShoppingCart';
import {useSaleForm} from '../../hooks/sale/useSaleForm';
import '../../styles/css/SaleForm.css';

export const SaleForm = ({saleSelected}) => {
    const {
        user,
        customers,
        products,
        employees,
        formData,
        saleDetails,
        productSearch,
        paymentMethodId,
        paid,
        notes,
        selectedProductData,
        errors,
        isSubmitting,
        isEditMode,
        selectedCustomer,
        canSaveDeliveryOrder,
        isAdmin,
        operationType,
        deliveryEmployeeId,
        deliveryCost,
        setProductSearch,
        setSelectedProductData,
        setPaymentMethodId,
        setPaid,
        setNotes,
        setDeliveryEmployeeId,
        setDeliveryCost,
        setOperationType,
        handleSelectProduct,
        handleAddToCart,
        handleRemoveProduct,
        handleInputChange,
        handleLocalCancel,
        handleSubmit,
        formatCurrency
    } = useSaleForm(saleSelected);

    return (
        <Box sx={{flexGrow: 1, p: 3, minHeight: 'calc(100vh - 350px)'}} className="sale-form-container">
            <form onSubmit={handleSubmit} noValidate style={{height: '100%'}}>
                <Grid container spacing={3} sx={{height: '100%', flexWrap: 'nowrap !important'}}>
                    {/* Columna Izquierda - Lista de Productos */}
                    <Grid
                        sx={{height: '100%', minWidth: '400px', flex: '1 1 50%', maxWidth: '50% !important'}}>
                        <ProductsTable
                            products={products}
                            productSearch={productSearch}
                            onProductSearchChange={setProductSearch}
                            onSelectProduct={handleSelectProduct}
                            formatCurrency={formatCurrency}
                        />
                    </Grid>

                    {/* Columna Derecha */}
                    <Grid item xs={6} sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: '400px',
                        flex: '1 1 50%',
                        maxWidth: '50% !important',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            height: '100%',
                            overflow: 'auto',
                            minHeight: 0
                        }}>
                            {/* Selector de tipo de operación para ROLE_ADMIN */}
                            {isAdmin && (
                                <Paper elevation={2} sx={{p: 2}}>
                                    <FormControl fullWidth>
                                        <InputLabel id="operation-type-label">Tipo de Operación</InputLabel>
                                        <Select
                                            labelId="operation-type-label"
                                            id="operation-type-select"
                                            value={operationType}
                                            label="Tipo de Operación"
                                            onChange={(e) => setOperationType(e.target.value)}
                                        >
                                            <MenuItem value="venta">Venta</MenuItem>
                                            <MenuItem value="pedido">Pedido</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {operationType === 'venta' && (
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{mt: 1, display: 'block'}}>
                                            Modo Venta: No se creará pedido de entrega
                                        </Typography>
                                    )}
                                    {operationType === 'pedido' && (
                                        <Typography variant="caption" color="primary" sx={{mt: 1, display: 'block'}}>
                                            Modo Pedido: Se creará pedido de entrega
                                        </Typography>
                                    )}
                                </Paper>
                            )}

                            <SaleInfo
                                user={user}
                                customers={customers}
                                formData={formData}
                                selectedCustomer={selectedCustomer}
                                paymentMethodId={paymentMethodId}
                                paid={paid}
                                notes={notes}
                                errors={errors}
                                onInputChange={handleInputChange}
                                onPaymentMethodChange={setPaymentMethodId}
                                onPaidChange={setPaid}
                                onNotesChange={setNotes}
                            />

                            {canSaveDeliveryOrder && (
                                <DeliveryOrder
                                    selectedCustomer={selectedCustomer}
                                    deliveryEmployeeId={deliveryEmployeeId}
                                    deliveryCost={deliveryCost}
                                    employees={employees}
                                    onDeliveryEmployeeChange={setDeliveryEmployeeId}
                                    onDeliveryCostChange={setDeliveryCost}
                                    canSaveDeliveryOrder={canSaveDeliveryOrder}
                                />
                            )}

                            <AddProductForm
                                selectedProductData={selectedProductData}
                                errors={errors}
                                onSelectedProductChange={setSelectedProductData}
                                onAddToCart={handleAddToCart}
                                formatCurrency={formatCurrency}
                            />

                            <ShoppingCart
                                saleDetails={saleDetails}
                                formData={formData}
                                isEditMode={isEditMode}
                                isSubmitting={isSubmitting}
                                errors={errors}
                                onRemoveProduct={handleRemoveProduct}
                                onCancel={handleLocalCancel}
                                formatCurrency={formatCurrency}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};
