import {useState} from 'react';
import {Button, Typography} from '@mui/material';
import {CreditScoreOutlined} from '@mui/icons-material';
import {AccountDialog} from './AccountDialog.jsx';
import {MoneyField} from './MoneyField.jsx';
import {useUpdateCreditLimit} from '../../hooks/customerAccount/useUpdateCreditLimit.js';
import {useMoneyDialogFlow} from '../../hooks/customerAccount/useMoneyDialogFlow.js';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';
import {formatMoney, parseMoneyInput} from '../../utils/money.js';

// 5.8 Límite de crédito (ADMIN). 0 = sin crédito.
export const CreditLimitDialog = ({customerId, customerName, creditLimit, totalDebt, onClose, onCompleted}) => {
    const {updateCreditLimit} = useUpdateCreditLimit();
    const flow = useMoneyDialogFlow();
    const [limitText, setLimitText] = useState(() => (creditLimit / 100).toFixed(2));

    const {cents: newLimit, valid} = parseMoneyInput(limitText);
    const limitError = flow.fieldErrors.creditLimit
        || (!valid ? 'Captura un monto válido, con hasta 2 decimales.' : null);
    const canSave = valid && !limitError && newLimit !== creditLimit;

    const handleSubmit = async () => {
        const outcome = await flow.submit(() => updateCreditLimit(customerId, newLimit));
        if (outcome.ok) {
            onCompleted?.();
            onClose();
        }
    };

    return (
        <AccountDialog
            title="Límite de crédito"
            subtitle={customerName}
            icon={CreditScoreOutlined}
            busy={flow.submitting}
            networkError={flow.networkError}
            onRetry={handleSubmit}
            onClose={onClose}
            actions={(
                <>
                    <Button onClick={onClose} variant="outlined" disabled={flow.submitting}
                            sx={customerAccountStyles.touchButton}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={!canSave || flow.submitting}
                            sx={customerAccountStyles.touchButton}>
                        {flow.submitting ? 'Guardando...' : 'Guardar'}
                    </Button>
                </>
            )}
        >
            <Typography variant="body2" sx={{color: 'text.secondary'}}>
                Deuda actual: <strong>{formatMoney(totalDebt)}</strong>
            </Typography>
            <MoneyField
                label="Límite de crédito"
                value={limitText}
                onChange={(text) => {
                    setLimitText(text);
                    flow.clearFieldError('creditLimit');
                }}
                error={limitError}
                helperText="0 = sin crédito"
                autoFocus
            />
        </AccountDialog>
    );
};
