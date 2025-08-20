import React, {useState} from 'react';
import {useProduct} from '../../hooks/product/useProduct';
import {useNavigate} from 'react-router-dom';
import {formStyles} from '../../styles/js/FormStyles';

export const ProductForm = ({productSelected, onProductCreated, onCancel}) => {
    const {handleCreateProduct} = useProduct();
    const navigate = useNavigate();
    const isEditMode = productSelected && productSelected.id !== 0;

    const [formData, setFormData] = useState({
        name: productSelected?.name || '',
        category: productSelected?.category || '',
        price: productSelected?.price || '',
        unitMeasure: productSelected?.unitMeasure || '',
        active: productSelected?.active !== undefined ? productSelected.active : true
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Categories enum values (based on typical POS categories)
    const categories = [
        {value: 'FOOD', label: 'Comida'},
        {value: 'BEVERAGE', label: 'Bebida'},
        {value: 'DESSERT', label: 'Postre'},
        {value: 'APPETIZER', label: 'Entrada'},
        {value: 'MAIN_COURSE', label: 'Plato Principal'},
        {value: 'SIDE_DISH', label: 'Acompañamiento'},
        {value: 'OTHER', label: 'Otro'}
    ];

    // Unit measures enum values
    const unitMeasures = [
        {value: 'UNIT', label: 'Unidad'},
        {value: 'KILOGRAM', label: 'Kilogramo'},
        {value: 'GRAM', label: 'Gramo'},
        {value: 'LITER', label: 'Litro'},
        {value: 'MILLILITER', label: 'Mililitro'},
        {value: 'PORTION', label: 'Porción'},
        {value: 'DOZEN', label: 'Docena'}
    ];

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del producto es obligatorio';
        } else if (formData.name.length < 2 || formData.name.length > 100) {
            newErrors.name = 'El nombre del producto debe tener entre 2 y 100 caracteres';
        }

        // Category validation
        if (!formData.category) {
            newErrors.category = 'La categoría es obligatoria';
        }

        // Price validation
        if (!formData.price) {
            newErrors.price = 'El precio es obligatorio';
        } else {
            const price = parseFloat(formData.price);
            if (isNaN(price) || price <= 0) {
                newErrors.price = 'El precio debe de ser mayor que 0';
            } else if (price > 99999999.99) {
                newErrors.price = 'El precio debe de ser menor que 99999999.99';
            } else if (!/^\d{1,6}(\.\d{1,2})?$/.test(formData.price)) {
                newErrors.price = 'El precio debe tener un máximo de 6 dígitos enteros y 2 decimales';
            }
        }

        // Unit measure validation
        if (!formData.unitMeasure) {
            newErrors.unitMeasure = 'La unidad de medida es obligatoria';
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
            const productData = {
                id: productSelected?.id || 0,
                name: formData.name.trim(),
                category: formData.category,
                price: parseFloat(formData.price),
                unitMeasure: formData.unitMeasure,
                active: formData.active
            };

            const success = await handleCreateProduct(productData);

            if (success) {
                // Reset form
                setFormData({
                    name: '',
                    category: '',
                    price: '',
                    unitMeasure: '',
                    active: true
                });
                setErrors({});

                if (onProductCreated) {
                    onProductCreated();
                }
                navigate('/products');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate('/products');
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-header" style={formStyles.cardHeader}>
                            <h5 className="card-title mb-4 fw-bold">
                                {isEditMode ? 'Editar Producto' : 'Registrar Nuevo Producto'}
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row g-3">
                                    {/* Nombre del Producto */}
                                    <div className="col-12">
                                        <label htmlFor="name" className="form-label">
                                            Nombre del Producto <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            value={formData.name}
                                            onChange={handleInputChange('name')}
                                            required
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Categoría */}
                                    <div className="col-md-6">
                                        <label htmlFor="category" className="form-label">
                                            Categoría <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                                            id="category"
                                            value={formData.category}
                                            onChange={handleInputChange('category')}
                                            required
                                        >
                                            <option value="">Seleccione una categoría</option>
                                            {categories.map((category) => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category && (
                                            <div className="invalid-feedback">
                                                {errors.category}
                                            </div>
                                        )}
                                    </div>

                                    {/* Unidad de Medida */}
                                    <div className="col-md-6">
                                        <label htmlFor="unitMeasure" className="form-label">
                                            Unidad de Medida <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={`form-select ${errors.unitMeasure ? 'is-invalid' : ''}`}
                                            id="unitMeasure"
                                            value={formData.unitMeasure}
                                            onChange={handleInputChange('unitMeasure')}
                                            required
                                        >
                                            <option value="">Seleccione una unidad</option>
                                            {unitMeasures.map((unit) => (
                                                <option key={unit.value} value={unit.value}>
                                                    {unit.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.unitMeasure && (
                                            <div className="invalid-feedback">
                                                {errors.unitMeasure}
                                            </div>
                                        )}
                                    </div>

                                    {/* Precio */}
                                    <div className="col-md-6">
                                        <label htmlFor="price" className="form-label">
                                            Precio <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">$</span>
                                            <input
                                                type="number"
                                                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                                id="price"
                                                value={formData.price}
                                                onChange={handleInputChange('price')}
                                                step="0.01"
                                                min="0.01"
                                                max="99999999.99"
                                                required
                                            />
                                            {errors.price && (
                                                <div className="invalid-feedback">
                                                    {errors.price}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Estado del Producto */}
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
                                                Producto Activo
                                            </label>
                                        </div>
                                    </div>

                                    {/* Botones */}
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
