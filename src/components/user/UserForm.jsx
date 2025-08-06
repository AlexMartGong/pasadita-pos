import {useState, useEffect} from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Grid,
    Typography
} from '@mui/material';
import {Save, Cancel} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';

export const UserForm = ({userSelected}) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
        position: '',
        phone: '',
        active: true
    });

    const [errors, setErrors] = useState({});

    // Position options based on the enum
    const positionOptions = [
        {value: 'ROLE_ADMIN', label: 'Administrador'},
        {value: 'ROLE_CAJERO', label: 'Cajero'},
        {value: 'ROLE_PEDIDOS', label: 'Pedidos'}
    ];

    useEffect(() => {
        if (userSelected && userSelected.id !== 0) {
            setFormData({
                fullName: userSelected.fullName || '',
                username: userSelected.username || '',
                password: '', // Don't populate password for security
                position: userSelected.position || '',
                phone: userSelected.phone || '',
                active: userSelected.active !== undefined ? userSelected.active : true
            });
        }
    }, [userSelected]);

    const handleInputChange = (e) => {
        const {name, value, checked, type} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'El nombre completo es requerido';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'El nombre de usuario es requerido';
        }

        if ((!userSelected || !userSelected.id) && !formData.password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        }

        if (!formData.position) {
            newErrors.position = 'La posición es requerida';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form data to submit:', formData);
            // Here you would call the API to save the user
            // For now, just log and navigate back
            navigate('/users');
        }
    };

    const handleCancel = () => {
        navigate('/users');
    };

    const isEditMode = userSelected && userSelected.id !== 0;

    return (
        <Box sx={{maxWidth: 600, mx: 'auto'}}>
            <Card elevation={3}>
                <CardHeader
                    title={
                        <Typography variant="h5" component="h1" sx={{fontWeight: 'bold'}}>
                            {isEditMode ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
                        </Typography>
                    }
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '& .MuiCardHeader-title': {color: 'white'}
                    }}
                />
                <CardContent sx={{p: 3}}>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nombre Completo"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    error={!!errors.fullName}
                                    helperText={errors.fullName}
                                    required
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Nombre de Usuario"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    error={!!errors.username}
                                    helperText={errors.username}
                                    required
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={isEditMode ? "Nueva Contraseña (opcional)" : "Contraseña"}
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    error={!!errors.password}
                                    helperText={errors.password || (isEditMode ? "Dejar vacío para mantener la actual" : "")}
                                    required={!isEditMode}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.position} required>
                                    <InputLabel id="position-label">Posición</InputLabel>
                                    <Select
                                        labelId="position-label"
                                        id="position"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        label="Posición"
                                        fullWidth
                                    >
                                        {positionOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.position && (
                                        <Typography variant="caption" color="error" sx={{ml: 2, mt: 0.5}}>
                                            {errors.position}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                    required
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.active}
                                            onChange={handleInputChange}
                                            name="active"
                                            color="primary"
                                        />
                                    }
                                    label="Usuario Activo"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2}}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleCancel}
                                        startIcon={<Cancel/>}
                                        sx={{minWidth: 120}}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<Save/>}
                                        sx={{minWidth: 120}}
                                    >
                                        {isEditMode ? 'Actualizar' : 'Guardar'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}