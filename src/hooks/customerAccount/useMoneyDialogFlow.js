import {useCallback, useState} from "react";
import {createClientRequestId} from "../../utils/clientRequestId.js";

// Flujo común de los diálogos que mueven dinero: Captura → Revisar → Resultado (U3). El clientRequestId se
// genera al montar el diálogo (se monta al abrirse) y se reutiliza en cada reintento (U4, U5).
export const useMoneyDialogFlow = () => {
    const [clientRequestId] = useState(createClientRequestId);
    const [step, setStep] = useState('capture');
    const [submitting, setSubmitting] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [networkError, setNetworkError] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [result, setResult] = useState(null);

    const goToReview = useCallback(() => setStep('review'), []);
    const backToCapture = useCallback(() => {
        setNetworkError(false);
        setStep('capture');
    }, []);

    const clearFieldError = useCallback((field) => {
        setFieldErrors((previous) => {
            if (!previous[field]) return previous;
            const next = {...previous};
            delete next[field];
            return next;
        });
    }, []);

    // `request` recibe {clientRequestId, isRetry} y devuelve {ok, data, fieldErrors, isNetworkError}.
    const submit = useCallback(async (request) => {
        setSubmitting(true);
        setNetworkError(false);
        const outcome = await request({clientRequestId, isRetry: attempts > 0});
        setAttempts((count) => count + 1);
        setSubmitting(false);

        if (outcome.ok) {
            setResult(outcome.data);
            setStep('result');
        } else if (outcome.fieldErrors) {
            setFieldErrors(outcome.fieldErrors);
            setStep('capture');
        } else {
            setNetworkError(Boolean(outcome.isNetworkError));
        }
        return outcome;
    }, [clientRequestId, attempts]);

    return {
        clientRequestId,
        step,
        submitting,
        networkError,
        fieldErrors,
        result,
        goToReview,
        backToCapture,
        clearFieldError,
        submit,
    };
};
