import {StatsCard} from "../common/StatsCard.jsx";
import {StatsCardContainer} from "../common/StatsCardContainer.jsx";
import {formatCurrency} from "../../utils/formatters.js";
import {AttachMoney, ConfirmationNumber, LocalOffer, LocalShipping} from "@mui/icons-material";

export const FinancialSummarySection = ({financialSummary}) => {
    if (!financialSummary) return null;

    return (
        <StatsCardContainer>
            <StatsCard
                label="Ventas Totales"
                value={formatCurrency(financialSummary.totalSales)}
                icon={AttachMoney}
                color="success"
            />
            <StatsCard
                label="Ticket Promedio"
                value={formatCurrency(financialSummary.averageTicket)}
                icon={ConfirmationNumber}
                color="primary"
            />
            <StatsCard
                label="Descuentos Totales"
                value={formatCurrency(financialSummary.totalDiscounts)}
                icon={LocalOffer}
                color="warning"
            />
            <StatsCard
                label="Ingresos por Envio"
                value={formatCurrency(financialSummary.deliveryRevenue)}
                icon={LocalShipping}
                color="info"
            />
        </StatsCardContainer>
    );
};
