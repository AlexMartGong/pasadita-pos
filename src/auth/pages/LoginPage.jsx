import {useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import {LockOutlined, PersonOutline, Store, Visibility, VisibilityOff} from "@mui/icons-material";
import {useAuth} from "../hooks/useAuth";
import {loginPageStyles} from "../../styles/js/LoginPageStyles";

export const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const {handlerLogin, isLoginLoading} = useAuth();

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.username.trim() && formData.password.trim()) {
            await handlerLogin(formData);
        }
    };

    return (
        <Box sx={loginPageStyles.container}>
            <Card elevation={0} sx={loginPageStyles.card}>
                <CardContent sx={loginPageStyles.cardContent}>
                    <Box sx={loginPageStyles.header}>
                        <Avatar sx={loginPageStyles.avatar}>
                            <Store sx={loginPageStyles.storeIcon}/>
                        </Avatar>
                        <Typography variant="h5" component="h1" sx={loginPageStyles.title}>
                            La Pasadita
                        </Typography>
                        <Typography variant="body2" sx={loginPageStyles.subtitle}>
                            Punto de Venta para Frutería
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} sx={loginPageStyles.form}>
                        <TextField
                            id="username"
                            name="username"
                            label="Usuario"
                            value={formData.username}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            autoFocus
                            autoComplete="username"
                            disabled={isLoginLoading}
                            sx={loginPageStyles.textField}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutline/>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />

                        <TextField
                            id="password"
                            name="password"
                            label="Contraseña"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            autoComplete="current-password"
                            disabled={isLoginLoading}
                            sx={loginPageStyles.textField}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                onClick={handleTogglePassword}
                                                disabled={isLoginLoading}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isLoginLoading}
                            sx={loginPageStyles.loginButton}
                        >
                            {isLoginLoading ? (
                                <>
                                    <CircularProgress size={20} color="inherit" sx={loginPageStyles.buttonSpinner}/>
                                    Iniciando sesión...
                                </>
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </Button>
                    </Box>

                    <Box sx={loginPageStyles.footer}>
                        <Typography variant="caption">
                            Frutas frescas, servicio de calidad
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};
