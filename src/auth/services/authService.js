import axios from "axios";

export const loginValidation = async ({username, password}) => {
    try {
        return await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {username, password});
    } catch (error) {
        console.error("Error in loginValidation:", error);
        throw error;
    }
}
