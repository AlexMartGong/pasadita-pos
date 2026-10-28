import {Autocomplete, Box, MenuItem, TextField} from "@mui/material";
import {customerAccountStyles} from "../../styles/js/CustomerAccountStyles.js";
import {PAYMENT_HISTORY_ACTIONS} from "../../utils/paymentHistoryActions.js";

// Filtros del historial global: rango de fechas de México (inclusivo), quién hizo el cambio, cliente y acción.
export const PaymentHistoryFilters = ({filters, onChange, employees, customers, rangeError}) => {
    const selectedCustomer = customers.find((customer) => customer.id === filters.customerId) ?? null;

    return (
        <Box sx={customerAccountStyles.filtersBar}>
            <TextField
                label="Desde"
                type="date"
                value={filters.from}
                onChange={(event) => onChange({from: event.target.value})}
                error={Boolean(rangeError)}
                slotProps={{inputLabel: {shrink: true}}}
            />
            <TextField
                label="Hasta"
                type="date"
                value={filters.to}
                onChange={(event) => onChange({to: event.target.value})}
                error={Boolean(rangeError)}
                helperText={rangeError}
                slotProps={{inputLabel: {shrink: true}, htmlInput: {min: filters.from || undefined}}}
            />
            <TextField
                select
                label="Empleado"
                value={filters.employeeId}
                onChange={(event) => onChange({employeeId: event.target.value})}
            >
                <MenuItem value="">Todos</MenuItem>
                {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>{employee.fullName || employee.username}</MenuItem>
                ))}
            </TextField>
            <Autocomplete
                options={customers}
                value={selectedCustomer}
                onChange={(event, customer) => onChange({customerId: customer?.id ?? ''})}
                getOptionLabel={(customer) => customer.name ?? ''}
                getOptionKey={(customer) => customer.id}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => <TextField {...params} label="Cliente"/>}
            />
            <TextField
                select
                label="Acción"
                value={filters.action}
                onChange={(event) => onChange({action: event.target.value})}
            >
                <MenuItem value="">Todas</MenuItem>
                {Object.entries(PAYMENT_HISTORY_ACTIONS).map(([action, config]) => (
                    <MenuItem key={action} value={action}>{config.label}</MenuItem>
                ))}
            </TextField>
        </Box>
    );
};
