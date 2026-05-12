import {configureStore} from "@reduxjs/toolkit";
import {authSlice} from "./slices/auth/authSlice.js";
import {userSlice} from "./slices/user/userSlice.js";
import {productSlice} from "./slices/product/productSlice.js";
import {customerSlice} from "./slices/customer/customerSlice.js";
import {customerTypeSlice} from "./slices/customer/customerTypeSlice.js";
import {customerFiscalDataSlice} from "./slices/customerFiscalData/customerFiscalDataSlice.js";
import {saleSlice} from "./slices/sale/saleSlice.js";
import {invoiceSlice} from "./slices/invoice/invoiceSlice.js";
import {deliveryOrderSlice} from "./slices/deliveryOrder/deliveryOrderSlice.js";
import {dashboardSlice} from "./slices/dashboard/dashboardSlice.js";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        user: userSlice.reducer,
        product: productSlice.reducer,
        customer: customerSlice.reducer,
        customerType: customerTypeSlice.reducer,
        customerFiscalData: customerFiscalDataSlice.reducer,
        sale: saleSlice.reducer,
        invoice: invoiceSlice.reducer,
        deliveryOrder: deliveryOrderSlice.reducer,
        dashboard: dashboardSlice.reducer,
    },
});
