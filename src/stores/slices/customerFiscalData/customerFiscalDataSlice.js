import {createSlice} from "@reduxjs/toolkit";

export const initialCustomerFiscalDataForm = {
    fiscalId: 0,
    rfc: '',
    razonSocial: '',
    regimenFiscal: '',
    codigoPostalFiscal: '',
    usoCfdi: '',
    emailFacturacion: '',
    phone: '',
    address: '',
    active: true,
}

export const customerFiscalDataSlice = createSlice({
    name: 'customerFiscalData',
    initialState: {
        customerFiscalDataList: [],
        customerFiscalDataSelected: initialCustomerFiscalDataForm,
    },
    reducers: {
        setCustomerFiscalDataList: (state, action) => {
            state.customerFiscalDataList = action.payload;
        },
        onCreateCustomerFiscalData: (state, action) => {
            state.customerFiscalDataList.push({
                ...action.payload,
            });
            state.customerFiscalDataSelected = initialCustomerFiscalDataForm;
        },
        onUpdateCustomerFiscalData: (state, action) => {
            const index = state.customerFiscalDataList.findIndex(item => item.fiscalId === action.payload.fiscalId);
            if (index !== -1) {
                state.customerFiscalDataList[index] = {
                    ...action.payload,
                }
            }
        },
        setCustomerFiscalDataSelected: (state, action) => {
            state.customerFiscalDataSelected = action.payload;
        },
        resetCustomerFiscalDataSelected: (state) => {
            state.customerFiscalDataSelected = initialCustomerFiscalDataForm;
        }
    }
});

export const {
    setCustomerFiscalDataList,
    onCreateCustomerFiscalData,
    onUpdateCustomerFiscalData,
    setCustomerFiscalDataSelected,
    resetCustomerFiscalDataSelected,
} = customerFiscalDataSlice.actions;
