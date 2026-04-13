import {createSlice} from "@reduxjs/toolkit";

export const initialDeliveryOrderForm = {
    id: 0,
    saleId: 0,
    requestDate: '',
    customerName: '',
    deliveryAddress: '',
    contactPhone: '',
    paid: false,
    total: 0,
    status: 'ACTIVO',
}

const calculateTotalAmount = (state) => {
    const activeOrders = state.deliveryOrders.filter(order => order.status === 'ACTIVO');
    state.totalAmount = activeOrders.reduce((sum, order) => sum + (order.total || 0), 0);
};

export const deliveryOrderSlice = createSlice({
    name: 'deliveryOrder',
    initialState: {
        deliveryOrders: [],
        deliveryOrderSelected: initialDeliveryOrderForm,
        totalOrders: 0,
        totalAmount: 0,
    },
    reducers: {
        setDeliveryOrders: (state, action) => {
            state.deliveryOrders = action.payload;
        },
        setTotalAmountAndOrders: (state, action) => {
            state.totalOrders = action.payload.totalOrders;
            state.totalAmount = action.payload.totalAmount;
        },
        onCreateDeliveryOrder: (state, action) => {
            state.deliveryOrders.push({
                ...action.payload,
            });
            state.deliveryOrderSelected = initialDeliveryOrderForm;
            state.totalOrders += 1;
            calculateTotalAmount(state);
        },
        onUpdateDeliveryOrderStatus: (state, action) => {
            const index = state.deliveryOrders.findIndex(order => order.id === action.payload.id);
            if (index !== -1) {
                state.deliveryOrders[index] = {
                    ...state.deliveryOrders[index],
                    ...action.payload,
                }
            }
            calculateTotalAmount(state);
        },
        onChangeStatusDeliveryOrder: (state, action) => {
            state.deliveryOrders = state.deliveryOrders.map(order => {
                return (order.saleId === action.payload.id) ? {
                    ...order,
                    paid: action.payload.paid,
                } : order;
            });
            calculateTotalAmount(state);
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
    setTotalAmountAndOrders,
    onCreateDeliveryOrder,
    onUpdateDeliveryOrderStatus,
    onChangeStatusDeliveryOrder,
    setDeliveryOrderSelected,
    resetDeliveryOrderSelected,
} = deliveryOrderSlice.actions;
