const AGENT_URL = 'http://localhost:8081';
const STATION_ID_KEY = 'stationId';

export const getStationId = async () => {
    try {
        const response = await fetch(`${AGENT_URL}/api/station`);
        const data = await response.json();
        if (data.stationId) {
            localStorage.setItem(STATION_ID_KEY, data.stationId);
            return data.stationId;
        }
    } catch (error) {
        console.warn('No se pudo conectar con el agente local:', error.message);
    }
    return localStorage.getItem(STATION_ID_KEY);
};

export const getCachedStationId = () => {
    return localStorage.getItem(STATION_ID_KEY);
};

const agentService = {
    getStationId,
    getCachedStationId,
};

export default agentService;
