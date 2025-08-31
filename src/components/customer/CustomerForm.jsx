import React, {useEffect, useState} from 'react';
import {useCustomer} from '../../hooks/customer/useCustomer';
import {useCustomerType} from '../../hooks/customer/useCustomerType';
import {formStyles} from '../../styles/js/FormStyles';

export const CustomerForm = ({customerSelected}) => {
    const {handleSaveCustomer, handleCancel, initialCustomerForm} = useCustomer();
    const {customerTypes, handleGetCustomerTypes} = useCustomerType();
    const isEditMode = customerSelected && customerSelected.id !== 0;
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(initialCustomerForm);

    useEffect(() => {
        handleGetCustomerTypes();
    }, []);

    useEffect(() => {
        if (customerSelected && customerSelected.id !== 0) {
            setFormData({
                id: customerSelected.id || 0,
                customerTypeId: customerSelected.customerTypeId || null,
                name: customerSelected.name || '',
                phone: customerSelected.phone || '',
                address: customerSelected.address || '',
                city: customerSelected.city || '',
                postalCode: customerSelected.postalCode || '',
                customDiscount: customerSelected.customDiscount || 0,
                notes: customerSelected.notes || '',
                active: customerSelected.active !== undefined ? customerSelected.active : true
            });
        }
    }, [customerSelected]);

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del cliente es obligatorio';
        } else if (formData.name.length < 2 || formData.name.length > 150) {
            newErrors.name = 'El nombre del cliente debe tener entre 2 y 150 caracteres';
        } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.name)) {
            newErrors.name = 'El nombre solo puede contener letras, números y espacios';
        }

        // Customer Type validation
        if (!formData.customerTypeId) {
            newErrors.customerTypeId = 'El tipo de cliente es obligatorio';
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es obligatorio';
        } else if (formData.phone.length < 10 || formData.phone.length > 15) {
            newErrors.phone = 'El teléfono debe tener entre 10 y 15 dígitos';
        } else if (!/^[0-9]+$/.test(formData.phone)) {
            newErrors.phone = 'El teléfono solo puede contener números';
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = 'La dirección es obligatoria';
        } else if (formData.address.length > 255) {
            newErrors.address = 'La dirección no puede exceder 255 caracteres';
        } else if (!/^[a-zA-Z0-9\s#.,'-]+$/.test(formData.address)) {
            newErrors.address = 'La dirección contiene caracteres inválidos';
        }

        // City validation
        if (!formData.city.trim()) {
            newErrors.city = 'La ciudad es obligatoria';
        } else if (formData.city.length > 100) {
            newErrors.city = 'La ciudad no puede exceder 100 caracteres';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.city)) {
            newErrors.city = 'La ciudad solo puede contener letras y espacios';
        }

        // Postal Code validation
        if (!formData.postalCode.trim()) {
            newErrors.postalCode = 'El código postal es obligatorio';
        } else if (formData.postalCode.length > 10) {
            newErrors.postalCode = 'El código postal no puede exceder 10 caracteres';
        } else if (!/^[a-zA-Z0-9\s-]*$/.test(formData.postalCode)) {
            newErrors.postalCode = 'El código postal contiene caracteres inválidos';
        }

        // Custom Discount validation
        if (formData.customDiscount === '' || formData.customDiscount === null || formData.customDiscount === undefined) {
            newErrors.customDiscount = 'El descuento personalizado es obligatorio';
        } else {
            const discount = parseFloat(formData.customDiscount);
            if (isNaN(discount) || discount < 0) {
                newErrors.customDiscount = 'El descuento debe ser un valor positivo';
            } else if (discount > 100) {
                newErrors.customDiscount = 'El descuento no puede ser mayor a 100%';
            }
        }

        // Notes validation
        if (!formData.notes.trim()) {
            newErrors.notes = 'Las notas son obligatorias';
        } else if (formData.notes.length > 500) {
            newErrors.notes = 'Las notas no pueden exceder 500 caracteres';
        } else if (!/^[a-zA-Z0-9\s.,'-]+$/.test(formData.notes)) {
            newErrors.notes = 'Las notas contienen caracteres inválidos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSwitchChange = (event) => {
        setFormData(prev => ({
            ...prev,
            active: event.target.checked
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const customerData = {
                id: customerSelected?.id || 0,
                customerTypeId: parseInt(formData.customerTypeId),
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                postalCode: formData.postalCode.trim(),
                customDiscount: parseFloat(formData.customDiscount),
                notes: formData.notes.trim(),
                active: formData.active
            };

            console.log('Customer Data:', customerData);

            const success = await handleSaveCustomer(customerData);

            if (success) {
                setFormData(initialCustomerForm);
                setErrors({});
                handleCancel();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div className="card shadow">
                        <div className="card-header" style={formStyles.cardHeader}>
                            <h5 className="card-title mb-4 fw-bold">
                                {isEditMode ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="name" className="form-label">
                                            Nombre del Cliente <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            value={formData.name}
                                            onChange={handleInputChange('name')}
                                            onKeyDown={(e) => {
                                                if (!/[a-zA-Z\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
                                            }}
                                            required
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="customerTypeId" className="form-label">
                                            Tipo de Cliente <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={`form-select ${errors.customerTypeId ? 'is-invalid' : ''}`}
                                            id="customerTypeId"
                                            value={formData.customerTypeId || ''}
                                            onChange={handleInputChange('customerTypeId')}
                                            required
                                        >
                                            <option value="">Seleccione un tipo de cliente</option>
                                            {customerTypes.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.customerTypeId && (
                                            <div className="invalid-feedback">
                                                {errors.customerTypeId}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="form-label">
                                            Teléfono <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                            id="phone"
                                            maxLength="10"
                                            value={formData.phone}
                                            onChange={handleInputChange('phone')}
                                            onKeyDown={(e) => {
                                                if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
                                            }}
                                            required
                                        />
                                        {errors.phone && (
                                            <div className="invalid-feedback">
                                                {errors.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="customDiscount" className="form-label">
                                            Descuento Personalizado<span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.customDiscount ? 'is-invalid' : ''}`}
                                            id="customDiscount"
                                            value={formData.customDiscount}
                                            onChange={handleInputChange('customDiscount')}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                        {errors.customDiscount && (
                                            <div className="invalid-feedback">
                                                {errors.customDiscount}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="address" className="form-label">
                                            Dirección <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                            id="address"
                                            value={formData.address}
                                            onChange={handleInputChange('address')}
                                            onKeyDown={(e) => {
                                                if (!/[a-zA-Z\s0-9\\#.,\-']/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
                                            }}
                                            required
                                        />
                                        {errors.address && (
                                            <div className="invalid-feedback">
                                                {errors.address}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="city" className="form-label">
                                            Ciudad <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                            id="city"
                                            value={formData.city}
                                            onChange={handleInputChange('city')}
                                            onKeyDown={(e) => {
                                                if (!/[a-zA-Z\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
                                            }}
                                            required
                                        />
                                        {errors.city && (
                                            <div className="invalid-feedback">
                                                {errors.city}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="postalCode" className="form-label">
                                            Código Postal <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
                                            id="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange('postalCode')}
                                            onKeyDown={(e) => {
                                                if (!/[0-9\s-]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
                                            }}
                                            maxLength="10"
                                            required
                                        />
                                        {errors.postalCode && (
                                            <div className="invalid-feedback">
                                                {errors.postalCode}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="notes" className="form-label">
                                            Notas <span className="text-danger">*</span>
                                        </label>
                                        <textarea
                                            className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                                            id="notes"
                                            rows="3"
                                            value={formData.notes}
                                            onChange={handleInputChange('notes')}
                                            onKeyDown={(e) => {
                                                if (!/[a-zA-Z0-9\s.,\-']/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
                                            }}
                                            required
                                        />
                                        {errors.notes && (
                                            <div className="invalid-feedback">
                                                {errors.notes}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="active"
                                                checked={formData.active}
                                                onChange={handleSwitchChange}
                                            />
                                            <label className="form-check-label" htmlFor="active">
                                                Cliente Activo
                                            </label>
                                        </div>
                                    </div>

                                    <input type="hidden" name="id" value={formData.id}/>

                                    <div className="col-12">
                                        <div className="d-flex gap-2 justify-content-end mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={handleCancel}
                                                disabled={isSubmitting}
                                            >
                                                <i className="fas fa-times me-2"></i>
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={isSubmitting}
                                            >
                                                <i className="fas fa-save me-2"></i>
                                                {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Guardar')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
