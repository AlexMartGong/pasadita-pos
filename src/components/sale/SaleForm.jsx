import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Box, Grid} from '@mui/material';
import {ProductCatalog} from './ProductCatalog';
import {OperationTypeToggle} from './OperationTypeToggle';
import {SaleInfo} from './SaleInfo';
import {DeliveryOrder} from './DeliveryOrder';
import {AddProductForm} from './AddProductForm';
import {ShoppingCart} from './ShoppingCart';
import {PostSaleSummaryModal} from './PostSaleSummaryModal';
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
        postSaleData,
        canOpenDrawer,
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
        handleClosePostSaleModal,
        handlePrintPostSaleTicket,
        handleOpenDrawer,
        validateForm,
        formatCurrency
    } = useSaleForm(saleSelected);

    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const searchInputRef = useRef(null);

    // Enfoca la barra de búsqueda tras un breve retardo para aguardar el
    // cierre de las transiciones de los diálogos de MUI.
    const focusSearch = useCallback(() => {
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);
    }, []);

    // Foco inicial al montar la vista.
    useEffect(() => {
        focusSearch();
    }, [focusSearch]);

    useEffect(() => {
        if (isProductDialogOpen && selectedProductData.id === '') {
            setIsProductDialogOpen(false);
        }
    }, [selectedProductData.id, isProductDialogOpen]);

    const handleOpenProductDialog = useCallback((product) => {
        handleSelectProduct(product);
        setIsProductDialogOpen(true);
    }, [handleSelectProduct]);

    // Cancelar la venta actual: limpia el estado y devuelve el foco al buscador.
    const handleCancelSale = useCallback(() => {
        handleLocalCancel();
        focusSearch();
    }, [handleLocalCancel, focusSearch]);

    // Cierre del modal post-venta ("Cerrar / No Imprimir"): foco al buscador.
    const handleClosePostSale = useCallback(() => {
        handleClosePostSaleModal();
        focusSearch();
    }, [handleClosePostSaleModal, focusSearch]);

    // "Imprimir Ticket" del modal post-venta: imprime, cierra y enfoca.
    const handlePrintPostSale = useCallback(() => {
        handlePrintPostSaleTicket();
        focusSearch();
    }, [handlePrintPostSaleTicket, focusSearch]);

    return (
        <Box sx={saleFormStyles.pageContainer}>
            <Grid container spacing={3}>
                {/* Lado izquierdo (~70%): catálogo de productos */}
                <Grid size={{xs: 12, md: 8, lg: 8.5}}>
                    <ProductCatalog
                        products={products}
                        productSearch={productSearch}
                        onProductSearchChange={setProductSearch}
                        onSelectProduct={handleOpenProductDialog}
                        formatCurrency={formatCurrency}
                        searchInputRef={searchInputRef}
                    />
                </Grid>

                {/* Lado derecho (~30%): panel de ticket */}
                <Grid size={{xs: 12, md: 4, lg: 3.5}}>
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
                            canOpenDrawer={canOpenDrawer}
                            onOpenDrawer={handleOpenDrawer}
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
                            onCancel={handleCancelSale}
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

            <PostSaleSummaryModal
                open={postSaleData.isOpen}
                onClose={handleClosePostSale}
                onPrint={handlePrintPostSale}
                total={postSaleData.total}
                amountTendered={postSaleData.amountTendered}
                changeDue={postSaleData.changeDue}
                formatCurrency={formatCurrency}
            />
        </Box>
    );
};
