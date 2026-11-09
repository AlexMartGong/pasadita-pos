import {customerAccountApi} from "../apis/customerAccountApi.js";
import {getSaleDetailsById} from "./saleService.js";
import {fromCents, toCents} from "../utils/money.js";
import {mapAccount, mapDebt, mapPaymentDetail, mapPaymentResult} from "./mappers/customerAccountMapper.js";

// Los montos entran en centavos y salen en centavos; aquí se convierten al formato del backend.
// Ningún body lleva employeeId: el backend lo toma del token.
class CustomerAccountService {
    async registerCollection(orderId, {amountReceived, paymentMethodId, clientRequestId}) {
        try {
            const response = await customerAccountApi.post(`/delivery-orders/${orderId}/collection`, {
                amountReceived: fromCents(amountReceived),
                paymentMethodId: amountReceived > 0 ? paymentMethodId : null,
                clientRequestId,
            });
            return mapPaymentResult(response.data);
        } catch (error) {
            console.error("Error registering delivery collection:", error);
            throw error;
        }
    }

    async registerAccountPayment(customerId, {amount, paymentMethodId, notes, clientRequestId}) {
        try {
            const response = await customerAccountApi.post(`/customers/${customerId}/payments`, {
                amount: fromCents(amount),
                paymentMethodId,
                notes: notes || null,
                clientRequestId,
            });
            return mapPaymentResult(response.data);
        } catch (error) {
            console.error("Error registering account payment:", error);
            throw error;
        }
    }

    async registerSalePayment(saleId, {amount, paymentMethodId, notes, clientRequestId}) {
        try {
            const response = await customerAccountApi.post(`/sales/${saleId}/payments`, {
                amount: fromCents(amount),
                paymentMethodId,
                notes: notes || null,
                clientRequestId,
            });
            return mapPaymentResult(response.data);
        } catch (error) {
            console.error("Error registering sale payment:", error);
            throw error;
        }
    }

    async getAccount(customerId) {
        try {
            const response = await customerAccountApi.get(`/customers/${customerId}/account`);
            return mapAccount(response.data);
        } catch (error) {
            console.error("Error fetching customer account:", error);
            throw error;
        }
    }

    async getSalePayments(saleId) {
        try {
            const response = await customerAccountApi.get(`/sales/${saleId}/payments`);
            return (response.data ?? []).map(mapPaymentDetail);
        } catch (error) {
            console.error("Error fetching sale payments:", error);
            throw error;
        }
    }

    // Los pedidos y los abonos no traen el cliente ni el total de su nota: se leen del detalle de la venta.
    async getNoteInfo(saleId) {
        try {
            const response = await getSaleDetailsById(saleId);
            const details = response.data;
            if (!details?.customerId) {
                throw Object.assign(new Error(`Sale details not found: ${saleId}`), {response: {status: 404, data: {}}});
            }
            return {
                saleId,
                customerId: details.customerId,
                deliveryOrderId: details.deliveryOrderId ?? null,
                total: toCents(details.total),
            };
        } catch (error) {
            console.error("Error fetching note info:", error);
            throw error;
        }
    }

    async getCustomerDebts() {
        try {
            const response = await customerAccountApi.get("/customers/debts");
            return (response.data ?? []).map(mapDebt);
        } catch (error) {
            console.error("Error fetching customer debts:", error);
            throw error;
        }
    }

    async updateCreditLimit(customerId, creditLimit) {
        try {
            const response = await customerAccountApi.patch(`/customers/${customerId}/credit-limit`, {
                creditLimit: fromCents(creditLimit),
            });
            return mapAccount(response.data);
        } catch (error) {
            console.error("Error updating credit limit:", error);
            throw error;
        }
    }
}

export const customerAccountService = new CustomerAccountService();
