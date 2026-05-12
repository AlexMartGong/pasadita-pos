import {invoiceApi} from "../apis/invoiceApi.js";

class InvoiceService {
    async getAllInvoices(page = 0, size = 20, sort) {
        try {
            const params = {page, size};
            if (sort) params.sort = sort;
            return await invoiceApi.get("", {params});
        } catch (error) {
            console.error("Error fetching invoices:", error);
            throw error;
        }
    }

    async timbrarInvoice(payload) {
        try {
            return await invoiceApi.post("/timbrar", payload);
        } catch (error) {
            console.error("Error timbrando invoice:", error);
            throw error;
        }
    }

    async cancelInvoice(invoiceId, motive = "02") {
        try {
            return await invoiceApi.delete(`/${invoiceId}`, {params: {motive}});
        } catch (error) {
            console.error("Error cancelando invoice:", error);
            throw error;
        }
    }

    async downloadInvoicePdf(saleId) {
        try {
            return await invoiceApi.get(`/sale/${saleId}/pdf`, {responseType: 'blob'});
        } catch (error) {
            console.error("Error descargando PDF:", error);
            throw error;
        }
    }

    async downloadInvoiceXml(saleId) {
        try {
            return await invoiceApi.get(`/sale/${saleId}/xml`, {responseType: 'blob'});
        } catch (error) {
            console.error("Error descargando XML:", error);
            throw error;
        }
    }

    async sendInvoiceEmail(saleId, email) {
        try {
            return await invoiceApi.post(`/sale/${saleId}/email`, null, {params: {email}});
        } catch (error) {
            console.error("Error enviando correo de factura:", error);
            throw error;
        }
    }
}

export const invoiceService = new InvoiceService();
