import {createSlice} from "@reduxjs/toolkit";

export const initialDeliveryOrderForm = {
    id: 0,
    saleId: null,
    requestDate: '',
    customerName: '',
    deliveryAddress: '',
    contactPhone: '',
    paid: false,
    total: 0,
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
        onChangeStatusDeliveryOrder: (state, action) => {
            state.deliveryOrders = state.deliveryOrders.map(order => {
                return (order.id === action.payload.id) ? {
                    ...order,
                    paid: action.payload.paid,
                } : order;
            });
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
    onChangeStatusDeliveryOrder,
    setDeliveryOrderSelected,
    resetDeliveryOrderSelected,
} = deliveryOrderSlice.actions;

