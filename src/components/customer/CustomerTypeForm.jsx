import React, {useEffect, useState} from 'react';
import {useCustomerType} from '../../hooks/customer/useCustomerType';
import {formStyles} from '../../styles/js/FormStyles';

export const CustomerTypeForm = ({customerTypeSelected}) => {
    const {handleCustomerTypeFormSubmit, handleCustomerTypeReset} = useCustomerType();
    const isEditMode = customerTypeSelected && customerTypeSelected.id !== 0;
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        description: '',
        discount: 0,
    });

    useEffect(() => {
        if (customerTypeSelected && customerTypeSelected.id !== 0) {
            setFormData({
                id: customerTypeSelected.id || 0,
                name: customerTypeSelected.name || '',
                description: customerTypeSelected.description || '',
                discount: customerTypeSelected.discount || 0,
            });
        }
    }, [customerTypeSelected]);

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del tipo de cliente es obligatorio';
        } else if (formData.name.length < 2 || formData.name.length > 100) {
            newErrors.name = 'El nombre debe tener entre 2 y 100 caracteres';
        } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.name)) {
            newErrors.name = 'El nombre solo puede contener letras, números y espacios';
        }

        // Description validation (now required based on backend DTO)
        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es obligatoria';
        } else if (formData.description.length > 255) {
            newErrors.description = 'La descripción no puede tener más de 255 caracteres';
        } else if (!/^[a-zA-Z0-9\s.,'-]+$/.test(formData.description)) {
            newErrors.description = 'La descripción contiene caracteres inválidos';
        }

        // Discount validation
        if (formData.discount === '' || formData.discount === null || formData.discount === undefined) {
            newErrors.discount = 'El descuento es obligatorio';
        } else {
            const discount = parseFloat(formData.discount);
            if (isNaN(discount) || discount < 0) {
                newErrors.discount = 'El descuento debe ser un valor positivo';
            } else if (discount > 15) {
                newErrors.discount = 'El descuento no puede ser mayor a $ 15';
            }
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const customerTypeData = {
                id: customerTypeSelected?.id || 0,
                name: formData.name.trim(),
                description: formData.description.trim(),
                discount: parseFloat(formData.discount)
            };

            console.log('Customer Type Data:', customerTypeData);

            await handleCustomerTypeFormSubmit(customerTypeData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        handleCustomerTypeReset();
        window.history.back();
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div className="card shadow">
                        <div className="card-header" style={formStyles.cardHeader}>
                            <h5 className="card-title mb-4 fw-bold">
                                {isEditMode ? 'Editar Tipo de Cliente' : 'Registrar Nuevo Tipo de Cliente'}
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="name" className="form-label">
                                            Nombre del Tipo <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            value={formData.name}
                                            onChange={handleInputChange('name')}
                                            onKeyDown={(e) => {
                                                if (!/[a-zA-Z0-9\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
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
                                        <label htmlFor="discount" className="form-label">
                                            Descuento ($) <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.discount ? 'is-invalid' : ''}`}
                                            id="discount"
                                            value={formData.discount}
                                            onChange={handleInputChange('discount')}
                                            step="1"
                                            min="0"
                                            max="15"
                                            required
                                        />
                                        {errors.discount && (
                                            <div className="invalid-feedback">
                                                {errors.discount}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="description" className="form-label">
                                            Descripción <span className="text-danger">*</span>
                                        </label>
                                        <textarea
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            id="description"
                                            rows="3"
                                            value={formData.description}
                                            onChange={handleInputChange('description')}
                                            onKeyDown={(e) => {
                                                if (!/[a-zA-Z0-9\s.,'-]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
                                            }}
                                            placeholder="Describe las características y beneficios de este tipo de cliente..."
                                            required
                                        />
                                        {errors.description && (
                                            <div className="invalid-feedback">
                                                {errors.description}
                                            </div>
                                        )}
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
