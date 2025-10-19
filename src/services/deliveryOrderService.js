import {deliveryOrderApi} from "../apis/deliveryOrderApi.js";

class DeliveryOrderService {
    async getAllDeliveryOrders() {
        try {
            const response = await deliveryOrderApi.get("/all");
            return response.data;
        } catch (error) {
            console.error('Error fetching delivery orders:', error);
            throw error;
        }
    }

    async saveDeliveryOrder(deliveryOrderData) {
        try {
            const response = await deliveryOrderApi.post("/save", deliveryOrderData);
            return response.data;
        } catch (error) {
            console.error('Error saving delivery order:', error);
            throw error;
        }
    }

    async changeDeliveryOrderStatus(id, statusData) {
        try {
            const response = await deliveryOrderApi.patch(`/change-status/${id}`, statusData);
            return response.data;
        } catch (error) {
            console.error('Error changing delivery order status:', error);
            throw error;
        }
    }
}

export const deliveryOrderService = new DeliveryOrderService();
