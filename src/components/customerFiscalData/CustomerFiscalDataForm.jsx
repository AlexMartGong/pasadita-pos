import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormControlLabel,
    Grid,
    MenuItem,
    Stack,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import {Cancel, Save} from '@mui/icons-material';
import {useCustomerFiscalData} from '../../hooks/customerFiscalData/useCustomerFiscalData.js';
import {formStyles} from '../../styles/js/FormStyles.js';

const REGIMEN_FISCAL_OPTIONS = [
    {code: '601', label: '601 - General de Ley Personas Morales'},
    {code: '603', label: '603 - Personas Morales con Fines no Lucrativos'},
    {code: '605', label: '605 - Sueldos y Salarios e Ingresos Asimilados'},
    {code: '606', label: '606 - Arrendamiento'},
    {code: '612', label: '612 - Personas Físicas con Actividades Empresariales'},
    {code: '616', label: '616 - Sin obligaciones fiscales'},
    {code: '621', label: '621 - Incorporación Fiscal'},
    {code: '626', label: '626 - Régimen Simplificado de Confianza'},
];

const USO_CFDI_OPTIONS = [
    {code: 'G01', label: 'G01 - Adquisición de mercancías'},
    {code: 'G03', label: 'G03 - Gastos en general'},
    {code: 'S01', label: 'S01 - Sin efectos fiscales'},
    {code: 'P01', label: 'P01 - Por definir'},
    {code: 'CP01', label: 'CP01 - Pagos'},
    {code: 'D01', label: 'D01 - Honorarios médicos, dentales y hospitalarios'},
    {code: 'D10', label: 'D10 - Pagos por servicios educativos'},
    {code: 'I08', label: 'I08 - Otra maquinaria y equipo'},
];

const RFC_REGEX = /^([A-ZÑ&]{3,4})(\d{6})([A-Z\d]{3})$/;

export const CustomerFiscalDataForm = ({fiscalDataSelected}) => {
    const {handleSaveFiscalData, handleCancel, initialCustomerFiscalDataForm} = useCustomerFiscalData();
    const isEditMode = fiscalDataSelected && fiscalDataSelected.fiscalId !== 0;
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(initialCustomerFiscalDataForm);

    useEffect(() => {
        if (fiscalDataSelected && fiscalDataSelected.fiscalId !== 0) {
            setFormData({
                fiscalId: fiscalDataSelected.fiscalId || 0,
                rfc: fiscalDataSelected.rfc || '',
                razonSocial: fiscalDataSelected.razonSocial || '',
                regimenFiscal: fiscalDataSelected.regimenFiscal || '',
                codigoPostalFiscal: fiscalDataSelected.codigoPostalFiscal || '',
                usoCfdi: fiscalDataSelected.usoCfdi || '',
                emailFacturacion: fiscalDataSelected.emailFacturacion || '',
                phone: fiscalDataSelected.phone || '',
                address: fiscalDataSelected.address || '',
                active: fiscalDataSelected.active ?? true,
            });
        }
    }, [fiscalDataSelected]);

    const validateForm = () => {
        const newErrors = {};
        const rfc = formData.rfc.trim().toUpperCase();
        if (!rfc) {
            newErrors.rfc = 'El RFC es obligatorio.';
        } else if (rfc.length < 12 || rfc.length > 13) {
            newErrors.rfc = 'El RFC debe tener 12 o 13 caracteres.';
        } else if (!RFC_REGEX.test(rfc)) {
            newErrors.rfc = 'Formato de RFC inválido.';
        }

        if (!formData.razonSocial.trim()) {
            newErrors.razonSocial = 'La razón social es obligatoria.';
        } else if (formData.razonSocial.length > 150) {
            newErrors.razonSocial = 'La razón social no puede exceder 150 caracteres.';
        }

        if (!formData.regimenFiscal.trim()) {
            newErrors.regimenFiscal = 'El régimen fiscal es obligatorio.';
        } else if (!/^\d{3}$/.test(formData.regimenFiscal.trim())) {
            newErrors.regimenFiscal = 'El régimen fiscal debe ser un código SAT de 3 dígitos.';
        }

        if (!formData.codigoPostalFiscal.trim()) {
            newErrors.codigoPostalFiscal = 'El código postal fiscal es obligatorio.';
        } else if (!/^\d{5}$/.test(formData.codigoPostalFiscal.trim())) {
            newErrors.codigoPostalFiscal = 'El código postal debe tener exactamente 5 dígitos.';
        }

        if (!formData.usoCfdi.trim()) {
            newErrors.usoCfdi = 'El uso de CFDI es obligatorio.';
        } else if (formData.usoCfdi.length < 3 || formData.usoCfdi.length > 4) {
            newErrors.usoCfdi = 'El uso de CFDI debe tener entre 3 y 4 caracteres.';
        }

        if (!formData.emailFacturacion.trim()) {
            newErrors.emailFacturacion = 'El email de facturación es obligatorio.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailFacturacion.trim())) {
            newErrors.emailFacturacion = 'Formato de email inválido.';
        } else if (formData.emailFacturacion.length > 100) {
            newErrors.emailFacturacion = 'El email no puede exceder 100 caracteres.';
        }

        if (formData.phone && !/^\d{7,15}$/.test(formData.phone.trim())) {
            newErrors.phone = 'El teléfono debe contener entre 7 y 15 dígitos.';
        }

        if (formData.address && formData.address.length > 200) {
            newErrors.address = 'La dirección no puede exceder 200 caracteres.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field) => (event) => {
        const value = field === 'active' ? event.target.checked : event.target.value;
        setFormData(prev => ({...prev, [field]: value}));
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: ''}));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                fiscalId: formData.fiscalId || 0,
                rfc: formData.rfc.trim().toUpperCase(),
                razonSocial: formData.razonSocial.trim(),
                regimenFiscal: formData.regimenFiscal.trim(),
                codigoPostalFiscal: formData.codigoPostalFiscal.trim(),
                usoCfdi: formData.usoCfdi.trim().toUpperCase(),
                emailFacturacion: formData.emailFacturacion.trim(),
                phone: formData.phone?.trim() || null,
                address: formData.address?.trim() || null,
                active: formData.active,
            };

            const success = await handleSaveFiscalData(payload);

            if (success) {
                setFormData(initialCustomerFiscalDataForm);
                setErrors({});
                handleCancel();
            }
        } catch (error) {
            console.error('Error submitting fiscal data form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{py: 3}}>
            <Card elevation={3} sx={formStyles.cardResponsive}>
                <Box sx={formStyles.cardHeader}>
                    <Typography variant="h6" component="h2" sx={{fontWeight: 'bold'}}>
                        {isEditMode ? 'Editar Datos Fiscales' : 'Registrar Nuevos Datos Fiscales'}
                    </Typography>
                </Box>
                <CardContent sx={{p: {xs: 2, sm: 3, md: 4}}}>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    required
                                    label="RFC"
                                    value={formData.rfc}
                                    onChange={handleInputChange('rfc')}
                                    error={!!errors.rfc}
                                    helperText={errors.rfc}
                                    slotProps={{htmlInput: {maxLength: 13, style: {textTransform: 'uppercase'}}}}
                                />
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Razón Social"
                                    value={formData.razonSocial}
                                    onChange={handleInputChange('razonSocial')}
                                    error={!!errors.razonSocial}
                                    helperText={errors.razonSocial}
                                    slotProps={{htmlInput: {maxLength: 150}}}
                                />
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    required
                                    select
                                    label="Régimen Fiscal"
                                    value={formData.regimenFiscal}
                                    onChange={handleInputChange('regimenFiscal')}
                                    error={!!errors.regimenFiscal}
                                    helperText={errors.regimenFiscal || 'Código SAT de 3 dígitos'}>
                                    <MenuItem value="">
                                        <em>Seleccione un régimen</em>
                                    </MenuItem>
                                    {REGIMEN_FISCAL_OPTIONS.map(opt => (
                                        <MenuItem key={opt.code} value={opt.code}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    required
                                    select
                                    label="Uso CFDI"
                                    value={formData.usoCfdi}
                                    onChange={handleInputChange('usoCfdi')}
                                    error={!!errors.usoCfdi}
                                    helperText={errors.usoCfdi || 'Código SAT del uso del comprobante'}>
                                    <MenuItem value="">
                                        <em>Seleccione un uso CFDI</em>
                                    </MenuItem>
                                    {USO_CFDI_OPTIONS.map(opt => (
                                        <MenuItem key={opt.code} value={opt.code}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Código Postal Fiscal"
                                    value={formData.codigoPostalFiscal}
                                    onChange={handleInputChange('codigoPostalFiscal')}
                                    error={!!errors.codigoPostalFiscal}
                                    helperText={errors.codigoPostalFiscal}
                                    slotProps={{htmlInput: {maxLength: 5, inputMode: 'numeric'}}}
                                />
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    required
                                    type="email"
                                    label="Email de Facturación"
                                    value={formData.emailFacturacion}
                                    onChange={handleInputChange('emailFacturacion')}
                                    error={!!errors.emailFacturacion}
                                    helperText={errors.emailFacturacion}
                                    slotProps={{htmlInput: {maxLength: 100}}}
                                />
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    value={formData.phone || ''}
                                    onChange={handleInputChange('phone')}
                                    error={!!errors.phone}
                                    helperText={errors.phone || 'Opcional'}
                                    slotProps={{htmlInput: {maxLength: 15, inputMode: 'tel'}}}
                                />
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={!!formData.active}
                                            onChange={handleInputChange('active')}
                                            color="success"
                                        />
                                    }
                                    label={formData.active ? 'Activo' : 'Inactivo'}
                                    sx={{mt: 1}}
                                />
                            </Grid>

                            <Grid size={{xs: 12}}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    label="Dirección"
                                    value={formData.address || ''}
                                    onChange={handleInputChange('address')}
                                    error={!!errors.address}
                                    helperText={errors.address || 'Opcional'}
                                    slotProps={{htmlInput: {maxLength: 200}}}
                                />
                            </Grid>

                            <Grid size={{xs: 12}}>
                                <Stack
                                    direction={{xs: 'column', sm: 'row'}}
                                    spacing={2}
                                    justifyContent="flex-end"
                                    sx={{mt: 2}}>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<Cancel/>}
                                        onClick={handleCancel}
                                        disabled={isSubmitting}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Save/>}
                                        disabled={isSubmitting}>
                                        {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Guardar')}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};
