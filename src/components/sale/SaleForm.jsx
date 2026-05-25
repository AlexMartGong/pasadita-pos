import React, {useEffect, useState} from 'react';
import {Box, Grid} from '@mui/material';
import {ProductCatalog} from './ProductCatalog';
import {OperationTypeToggle} from './OperationTypeToggle';
import {SaleInfo} from './SaleInfo';
import {DeliveryOrder} from './DeliveryOrder';
import {AddProductForm} from './AddProductForm';
import {ShoppingCart} from './ShoppingCart';
import {useSaleForm} from '../../hooks/sale/useSaleForm';
import {saleFormStyles} from '../../styles/js/SaleFormStyles';

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
        amountTendered,
        requiresInvoice,
        selectedFiscalId,
        customerFiscalDataList,
        setRequiresInvoice,
        setSelectedFiscalId,
        setProductSearch,
        setSelectedProductData,
        setPaymentMethodId,
        setPaid,
        setNotes,
        setDeliveryEmployeeId,
        setDeliveryCost,
        setAmountTendered,
        setOperationType,
        handleSelectProduct,
        handleAddToCart,
        handleRemoveProduct,
        handleInputChange,
        handleLocalCancel,
        handleSubmit,
        validateForm,
        formatCurrency
    } = useSaleForm(saleSelected);

    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

    useEffect(() => {
        if (isProductDialogOpen && selectedProductData.id === '') {
            setIsProductDialogOpen(false);
        }
    }, [selectedProductData.id, isProductDialogOpen]);

    const handleOpenProductDialog = (product) => {
        handleSelectProduct(product);
        setIsProductDialogOpen(true);
    };

    return (
        <Box sx={saleFormStyles.pageContainer}>
            <Grid container spacing={3}>
                {/* Lado izquierdo (~70%): catálogo de productos */}
                <Grid size={{xs: 12, md: 8}}>
                    <ProductCatalog
                        products={products}
                        productSearch={productSearch}
                        onProductSearchChange={setProductSearch}
                        onSelectProduct={handleOpenProductDialog}
                        formatCurrency={formatCurrency}
                    />
                </Grid>

                {/* Lado derecho (~30%): panel de ticket */}
                <Grid size={{xs: 12, md: 4}}>
                    <Box sx={saleFormStyles.rightPanel}>
                        <OperationTypeToggle
                            operationType={operationType}
                            onChange={setOperationType}
                            isAdmin={isAdmin}
                        />

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

                        <ShoppingCart
                            saleDetails={saleDetails}
                            formData={formData}
                            isEditMode={isEditMode}
                            isSubmitting={isSubmitting}
                            errors={errors}
                            amountTendered={amountTendered}
                            onAmountTenderedChange={setAmountTendered}
                            onRemoveProduct={handleRemoveProduct}
                            onCancel={handleLocalCancel}
                            onValidate={validateForm}
                            onSaveSale={handleSubmit}
                            formatCurrency={formatCurrency}
                            paymentMethodId={paymentMethodId}
                            requiresInvoice={requiresInvoice}
                            onRequiresInvoiceChange={setRequiresInvoice}
                            selectedFiscalId={selectedFiscalId}
                            onSelectedFiscalIdChange={setSelectedFiscalId}
                            fiscalList={customerFiscalDataList}
                        />
                    </Box>
                </Grid>
            </Grid>

            <AddProductForm
                open={isProductDialogOpen}
                onClose={() => setIsProductDialogOpen(false)}
                selectedProductData={selectedProductData}
                errors={errors}
                onSelectedProductChange={setSelectedProductData}
                onAddToCart={handleAddToCart}
                formatCurrency={formatCurrency}
            />
        </Box>
    );
};
