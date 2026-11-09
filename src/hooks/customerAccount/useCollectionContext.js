import {useAccountQuery} from "./useAccountQuery.js";
import {customerAccountService} from "../../services/customerAccountService.js";

// Datos para la vista previa del cobro de un pedido: el pedido no trae customerId, así que primero se lee
// de la nota (`/sales/{saleId}/details`) y luego se carga el estado de cuenta de ese cliente.
export const useCollectionContext = (saleId) => {
    const {data, loading, failed} = useAccountQuery(
        saleId ? `collection:${saleId}` : null,
        async () => {
            const note = await customerAccountService.getNoteInfo(saleId);
            const account = await customerAccountService.getAccount(note.customerId);
            return {customerId: note.customerId, account};
        }
    );

    return {customerId: data?.customerId ?? null, account: data?.account ?? null, loading, failed};
};
