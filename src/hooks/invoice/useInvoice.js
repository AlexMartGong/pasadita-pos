import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {toast} from "react-toastify";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {invoiceService} from "../../services/invoiceService.js";
import {
    setInvoiceList,
    onCreateInvoice,
    onUpdateInvoice,
    setInvoiceLoading,
} from "../../stores/slices/invoice/invoiceSlice.js";

export const useInvoice = () => {
    const {invoiceList, loading} = useSelector(state => state.invoice);
    const {handleApiError} = useApiErrorHandler();
    const dispatch = useDispatch();

    const handleGetAllInvoices = useCallback(async (page = 0, size = 20, sort) => {
        dispatch(setInvoiceLoading(true));
        try {
            const result = await invoiceService.getAllInvoices(page, size, sort);
            if (result.status === 200) {
                dispatch(setInvoiceList(result.data?.content ?? []));
            } else {
                toast.error('Error al obtener las facturas.');
            }
        } catch (error) {
            console.error('Error fetching all invoices:', error);
            handleApiError(error);
        } finally {
            dispatch(setInvoiceLoading(false));
        }
    }, [dispatch, handleApiError]);

    const handleTimbrarInvoice = useCallback(async ({saleId, fiscalId}) => {
        dispatch(setInvoiceLoading(true));
        try {
            const result = await invoiceService.timbrarInvoice({saleId, fiscalId});
            if (result.status === 200 || result.status === 201) {
                dispatch(onCreateInvoice(result.data));
                toast.success('Factura timbrada exitosamente.');
                return result.data;
            }
            toast.error('Error al timbrar la factura.');
            return null;
        } catch (error) {
            console.error('Error timbrando invoice:', error);
            handleApiError(error);
            return null;
        } finally {
            dispatch(setInvoiceLoading(false));
        }
    }, [dispatch, handleApiError]);

    const handleCancelInvoice = useCallback(async (invoiceId, motive = "02") => {
        dispatch(setInvoiceLoading(true));
        try {
            const result = await invoiceService.cancelInvoice(invoiceId, motive);
            if (result.status === 200) {
                dispatch(onUpdateInvoice(result.data));
                toast.success('Factura cancelada exitosamente.');
                return true;
            }
            toast.error('Error al cancelar la factura.');
            return false;
        } catch (error) {
            console.error('Error cancelando invoice:', error);
            handleApiError(error);
            return false;
        } finally {
            dispatch(setInvoiceLoading(false));
        }
    }, [dispatch, handleApiError]);

    const handleSendInvoiceEmail = useCallback(async (saleId, email) => {
        try {
            const result = await invoiceService.sendInvoiceEmail(saleId, email);
            if (result.status === 200) {
                toast.success('Correo enviado exitosamente.');
                return true;
            }
            toast.error('Error al enviar el correo.');
            return false;
        } catch (error) {
            console.error('Error enviando correo de factura:', error);
            handleApiError(error);
            return false;
        }
    }, [handleApiError]);

    const handleDownloadFile = useCallback(async (saleId, type) => {
        try {
            const result = type === 'pdf'
                ? await invoiceService.downloadInvoicePdf(saleId)
                : await invoiceService.downloadInvoiceXml(saleId);

            const mime = type === 'pdf' ? 'application/pdf' : 'application/xml';
            const blob = new Blob([result.data], {type: mime});
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `factura_venta_${saleId}.${type}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Archivo descargado exitosamente.');
            return true;
        } catch (error) {
            console.error('Error descargando archivo de factura:', error);
            handleApiError(error);
            return false;
        }
    }, [handleApiError]);

    return {
        invoiceList,
        loading,
        handleGetAllInvoices,
        handleTimbrarInvoice,
        handleCancelInvoice,
        handleSendInvoiceEmail,
        handleDownloadFile,
    };
};
