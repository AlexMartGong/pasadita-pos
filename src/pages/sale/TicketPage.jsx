import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    Chip,
    Divider,
    Paper,
    Typography
} from '@mui/material';
import {Print, ArrowBack, Receipt, Person, CalendarToday, AttachMoney} from '@mui/icons-material';
import {Ticket} from '../../components/sale/Ticket.jsx';
import {useSale} from '../../hooks/sale/useSale.js';
import {formatCurrency, formatDate} from '../../utils/formatters.js';

export const TicketPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {handleGetSaleDetails, handleGetTicket} = useSale();
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            setLoading(true);
            try {
                const data = await handleGetSaleDetails(parseInt(id));
                setTicketData(data);
            } catch (error) {
                console.error('Error fetching ticket:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTicket();
        }
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (!ticketData) {
        return (
            <Box sx={{p: 3}}>
                <Typography variant="h6" color="error">No se pudo cargar el ticket</Typography>
                <Button startIcon={<ArrowBack/>} onClick={handleBack} sx={{mt: 2}}>
                    Volver
                </Button>
            </Box>
        );
    }

    const isPedido = ticketData.deliveryOrderId !== null && ticketData.deliveryAddress !== null;

    return (
        <Box sx={{p: {xs: 2, md: 3}, maxWidth: 900, mx: 'auto'}}>
            {/* Barra de acciones */}
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3}}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack/>}
                    onClick={handleBack}
                    size="small"
                >
                    Volver
                </Button>
                <Button
                    variant="contained"
                    startIcon={<Print/>}
                    onClick={() => handleGetTicket(parseInt(id))}
                    color="primary"
                    size="large"
                    sx={{fontWeight: 700, px: 4}}
                >
                    Reimprimir Ticket
                </Button>
            </Box>

            {/* Tarjeta resumen para el empleado */}
            <Paper
                elevation={0}
                sx={{
                    mb: 3,
                    p: 2.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    background: '#f8f9fa'
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                    <Receipt sx={{color: 'text.secondary', fontSize: 20}}/>
                    <Typography variant="subtitle1" fontWeight={700}>
                        Resumen de la venta
                    </Typography>
                    <Chip
                        label={isPedido ? 'Pedido a domicilio' : 'Venta en caja'}
                        size="small"
                        color={isPedido ? 'info' : 'success'}
                        sx={{ml: 'auto'}}
                    />
                </Box>
                <Divider sx={{mb: 2}}/>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {xs: '1fr 1fr', sm: 'repeat(4, 1fr)'},
                    gap: 2
                }}>
                    <Box>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                            <Person sx={{fontSize: 14, color: 'text.secondary'}}/>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                CLIENTE
                            </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>{ticketData.customerName}</Typography>
                        <Typography variant="caption" color="text.secondary">{ticketData.customerPhone}</Typography>
                    </Box>
                    <Box>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                            <Person sx={{fontSize: 14, color: 'text.secondary'}}/>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                EMPLEADO
                            </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>{ticketData.employeeName}</Typography>
                    </Box>
                    <Box>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                            <CalendarToday sx={{fontSize: 14, color: 'text.secondary'}}/>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                FECHA
                            </Typography>
                        </Box>
                        <Typography variant="body2">{formatDate(ticketData.datetime)}</Typography>
                    </Box>
                    <Box>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                            <AttachMoney sx={{fontSize: 14, color: 'text.secondary'}}/>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                TOTAL
                            </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={700} color="success.dark" fontSize={16}>
                            {formatCurrency(ticketData.total)}
                        </Typography>
                        <Chip
                            label={ticketData.paid ? 'Pagado' : 'Pendiente'}
                            size="small"
                            color={ticketData.paid ? 'success' : 'warning'}
                            variant="outlined"
                            sx={{mt: 0.5, height: 20, fontSize: '0.65rem'}}
                        />
                    </Box>
                </Box>
            </Paper>

            {/* Vista previa del ticket */}
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Box>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{display: 'block', mb: 1, textAlign: 'center', letterSpacing: 1}}
                    >
                        VISTA PREVIA DEL TICKET
                    </Typography>
                    <Paper elevation={4} sx={{display: 'inline-block', borderRadius: 2}}>
                        <Ticket ticketData={ticketData}/>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};
