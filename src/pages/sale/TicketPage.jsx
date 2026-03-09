import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Box, Button, CircularProgress, Paper, Typography} from '@mui/material';
import {Print, ArrowBack} from '@mui/icons-material';
import {Ticket} from '../../components/sale/Ticket.jsx';
import {useSale} from '../../hooks/sale/useSale.js';

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
        navigate('/delivery');
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh'
                }}
            >
                <CircularProgress/>
            </Box>
        );
    }

    if (!ticketData) {
        return (
            <Box sx={{p: 3}}>
                <Typography variant="h6" color="error">
                    No se pudo cargar el ticket
                </Typography>
                <Button
                    startIcon={<ArrowBack/>}
                    onClick={handleBack}
                    sx={{mt: 2}}
                >
                    Volver
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{p: 3}}>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 3
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack/>}
                    onClick={handleBack}
                >
                    Volver
                </Button>
                <Button
                    variant="contained"
                    startIcon={<Print/>}
                    onClick={() => handleGetTicket(parseInt(id))}
                    color="primary"
                >
                    Imprimir Ticket
                </Button>
            </Box>

            <Paper
                elevation={3}
                sx={{
                    display: 'inline-block'
                }}
            >
                <Ticket ticketData={ticketData}/>
            </Paper>
        </Box>
    );
};
