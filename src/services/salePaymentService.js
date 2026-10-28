import {salePaymentApi} from "../apis/salePaymentApi.js";
import {fromCents} from "../utils/money.js";
import {mapHistory, mapPaymentResult} from "./mappers/customerAccountMapper.js";

const compactParams = (params) => Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== '')
);

class SalePaymentService {
    async modifyPayment(paymentId, {amount, paymentMethodId, reason}) {
        try {
            const response = await salePaymentApi.put(`/${paymentId}`, {
                amount: fromCents(amount),
                paymentMethodId,
                reason,
            });
            return mapPaymentResult(response.data);
        } catch (error) {
            console.error("Error modifying payment:", error);
            throw error;
        }
    }

    async cancelPayment(paymentId, reason) {
        try {
            const response = await salePaymentApi.put(`/${paymentId}/cancel`, {reason});
            return mapPaymentResult(response.data);
        } catch (error) {
            console.error("Error cancelling payment:", error);
            throw error;
        }
    }

    async getPaymentHistory(paymentId) {
        try {
            const response = await salePaymentApi.get(`/${paymentId}/history`);
            return (response.data ?? []).map(mapHistory);
        } catch (error) {
            console.error("Error fetching payment history:", error);
            throw error;
        }
    }

    // Historial global paginado. El orden lo fija el backend (más reciente primero): no se manda `sort`.
    async searchHistory({from, to, employeeId, customerId, action, page = 0, size = 20}) {
        try {
            const response = await salePaymentApi.get("/history", {
                params: compactParams({from, to, employeeId, customerId, action, page, size}),
            });
            return {
                rows: (response.data?.content ?? []).map(mapHistory),
                totalElements: response.data?.totalElements ?? 0,
            };
        } catch (error) {
            console.error("Error searching payment history:", error);
            throw error;
        }
    }
}

export const salePaymentService = new SalePaymentService();
