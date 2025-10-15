import {createSlice} from "@reduxjs/toolkit";

export const initialDeliveryOrderForm = {
    id: 0,
    saleId: null,
    deliveryEmployeeId: null,
    status: '',
    requestDate: new Date().toISOString(),
    deliveryAddress: '',
    contactPhone: '',
    deliveryCost: 0,
}

export const deliveryOrderSlice = createSlice({
    name: 'deliveryOrder',
    initialState: {
        deliveryOrders: [],
        deliveryOrderSelected: initialDeliveryOrderForm,
    },
    reducers: {
        setDeliveryOrders: (state, action) => {
            state.deliveryOrders = action.payload;
        },
        onCreateDeliveryOrder: (state, action) => {
            state.deliveryOrders.push({
                ...action.payload,
            });
            state.deliveryOrderSelected = initialDeliveryOrderForm;
        },
        onUpdateDeliveryOrderStatus: (state, action) => {
            const index = state.deliveryOrders.findIndex(order => order.id === action.payload.id);
            if (index !== -1) {
                state.deliveryOrders[index] = {
                    ...state.deliveryOrders[index],
                    ...action.payload,
                }
            }
        },
        setDeliveryOrderSelected: (state, action) => {
            state.deliveryOrderSelected = action.payload;
        },
        resetDeliveryOrderSelected: (state) => {
            state.deliveryOrderSelected = initialDeliveryOrderForm;
        }
    }
});

export const {
    setDeliveryOrders,
    onCreateDeliveryOrder,
    onUpdateDeliveryOrderStatus,
    setDeliveryOrderSelected,
    resetDeliveryOrderSelected,
} = deliveryOrderSlice.actions;

