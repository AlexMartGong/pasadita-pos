import {useAccountQuery} from "./useAccountQuery.js";
import {customerAccountService} from "../../services/customerAccountService.js";

// Datos para la vista previa del cobro de un pedido: el estado de cuenta de su cliente. El pedido ya trae
// `customerId`; solo si falta se lee de la nota (`/sales/{saleId}/details`).
export const useCollectionContext = (saleId, knownCustomerId) => {
    const {data, loading, failed} = useAccountQuery(
        saleId ? `collection:${saleId}` : null,
        async () => {
            const customerId = knownCustomerId ?? (await customerAccountService.getNoteInfo(saleId)).customerId;
            const account = await customerAccountService.getAccount(customerId);
            return {customerId, account};
        }
    );

    return {customerId: data?.customerId ?? null, account: data?.account ?? null, loading, failed};
};
