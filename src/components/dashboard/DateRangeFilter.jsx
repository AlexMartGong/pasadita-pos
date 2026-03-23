import {Box, Button, ButtonGroup, TextField} from "@mui/material";
import {CalendarMonth} from "@mui/icons-material";
import {useState} from "react";
import {dashboardStyles} from "../../styles/js/DashboardStyles.js";

const getPresetDates = (preset) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    switch (preset) {
        case 'today': {
            return {
                startDate: todayStart.toISOString().slice(0, 19),
                endDate: todayEnd.toISOString().slice(0, 19),
            };
        }
        case 'week': {
            const dayOfWeek = now.getDay();
            const monday = new Date(todayStart);
            monday.setDate(monday.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
            return {
                startDate: monday.toISOString().slice(0, 19),
                endDate: todayEnd.toISOString().slice(0, 19),
            };
        }
        case 'month': {
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
            return {
                startDate: monthStart.toISOString().slice(0, 19),
                endDate: todayEnd.toISOString().slice(0, 19),
            };
        }
        default:
            return {startDate: undefined, endDate: undefined};
    }
};

export const DateRangeFilter = ({onFilterChange}) => {
    const [activePreset, setActivePreset] = useState('month');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    const handlePreset = (preset) => {
        setActivePreset(preset);
        const {startDate, endDate} = getPresetDates(preset);
        onFilterChange(startDate, endDate);
    };

    const handleCustomApply = () => {
        if (customStart && customEnd) {
            setActivePreset('custom');
            onFilterChange(
                `${customStart}T00:00:00`,
                `${customEnd}T23:59:59`
            );
        }
    };

    return (
        <Box sx={dashboardStyles.filterContainer}>
            <CalendarMonth sx={{color: 'text.secondary', mr: 0.5}}/>
            <ButtonGroup size="small" variant="outlined">
                <Button
                    onClick={() => handlePreset('today')}
                    variant={activePreset === 'today' ? 'contained' : 'outlined'}
                >
                    Hoy
                </Button>
                <Button
                    onClick={() => handlePreset('week')}
                    variant={activePreset === 'week' ? 'contained' : 'outlined'}
                >
                    Esta Semana
                </Button>
                <Button
                    onClick={() => handlePreset('month')}
                    variant={activePreset === 'month' ? 'contained' : 'outlined'}
                >
                    Este Mes
                </Button>
            </ButtonGroup>
            <Box sx={{display: 'flex', gap: 1, alignItems: 'center', ml: {xs: 0, sm: 2}}}>
                <TextField
                    type="date"
                    size="small"
                    label="Desde"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    InputLabelProps={{shrink: true}}
                    sx={{width: 160}}
                />
                <TextField
                    type="date"
                    size="small"
                    label="Hasta"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    InputLabelProps={{shrink: true}}
                    sx={{width: 160}}
                />
                <Button
                    size="small"
                    variant={activePreset === 'custom' ? 'contained' : 'outlined'}
                    onClick={handleCustomApply}
                    disabled={!customStart || !customEnd}
                >
                    Aplicar
                </Button>
            </Box>
        </Box>
    );
};
