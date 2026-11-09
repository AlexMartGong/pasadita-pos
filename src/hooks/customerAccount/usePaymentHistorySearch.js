import {useAccountQuery} from "./useAccountQuery.js";
import {salePaymentService} from "../../services/salePaymentService.js";

// Historial global, paginado en el servidor. `paginationModel` es el de MUI DataGrid ({page, pageSize}).
// Con `enabled` en false (p. ej. rango de fechas inválido) no se consulta.
export const usePaymentHistorySearch = (filters, paginationModel, {enabled = true} = {}) => {
    const params = {...filters, page: paginationModel.page, size: paginationModel.pageSize};
    const {data, loading, reload} = useAccountQuery(
        enabled ? `payment-history-search:${JSON.stringify(params)}` : null,
        () => salePaymentService.searchHistory(params)
    );

    return {rows: data?.rows ?? [], totalElements: data?.totalElements ?? 0, loading, reload};
};
