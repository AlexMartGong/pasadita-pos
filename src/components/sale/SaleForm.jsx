import React from 'react';
import {Box, Grid} from '@mui/material';
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
        hasDeliveryRole,
        canSaveDeliveryOrder,
        deliveryEmployeeId,
        deliveryCost,
        setProductSearch,
        setSelectedProductData,
        setPaymentMethodId,
        setPaid,
        setNotes,
        setDeliveryEmployeeId,
        setDeliveryCost,
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
                    <Grid item xs={6}
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

                            {hasDeliveryRole && (
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
