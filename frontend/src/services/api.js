import axios from 'axios';

const PC_IP = "localhost"; // Set globally to allow phone connection over Wi-Fi
const API_URL = `http://${PC_IP}:8000`; // Direct connection to FastAPI backend

const api = {
    // Test connection
    testConnection: async () => {
        try {
            const response = await axios.get(`${API_URL}/`);
            return response.data;
        } catch (error) {
            console.error("API Connection Error:", error);
            throw error;
        }
    },

    // User Authentication
    register: async (email, password, healthGoal) => {
        try {
            const response = await axios.post(`${API_URL}/users/register`, {
                email,
                password,
                health_goal: healthGoal
            });
            return response.data;
        } catch (error) {
            console.error("Registration Error:", error.response?.data || error.message);
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/users/login`, {
                email,
                password
            });
            return response.data;
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            throw error;
        }
    },

    // --- Dashboard Data Endpoints ---
    getProfile: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateProfile: async (profileData) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.put(`${API_URL}/users/me/profile`, profileData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getTodaysLogs: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/logs/today`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getWeeklyAnalytics: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/analytics/weekly`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getAiInsights: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/analytics/ai-insights`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // --- Scanner & Product Endpoints ---
    getProduct: async (barcode) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/products/${barcode}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    logFood: async (barcode, serving_size = 1.0) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/logs/consume`, {
            barcode,
            serving_size
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    analyzeIngredients: async (ingredientsText, productName = "Custom Product") => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/products/analyze-ingredients`, {
            ingredients_text: ingredientsText,
            product_name: productName
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // --- Lenses Endpoints ---
    getCustomLenses: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/lenses/custom`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    createCustomLens: async (lensData) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/lenses/`, lensData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // --- Smart Cart Endpoints ---
    generateSmartCart: async (cartData) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/smart-cart/`, cartData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getLatestSmartCart: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/smart-cart/latest`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // --- Specific Feature Endpoints ---
    
    // Healthcheck / Test
    testConnection: async () => {
        try {
            const response = await axios.get(`${API_URL}/`);
            return response.data;
        } catch (error) {
            console.error("API Connection Error:", error);
            throw error;
        }
    },

    // --- Dashboard Modular Endpoints ---
    getDashboardDailySummary: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/dashboard/daily-summary`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getDashboardFoodLogs: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/dashboard/food-logs`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getDashboardRecentScans: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/dashboard/recent-scans`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getDashboardLensInsight: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/dashboard/lens-insight`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getDashboardWeeklyStats: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/dashboard/weekly-stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getDashboardHistory: async (date) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/dashboard/history?date=${date}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getDashboardHydration: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/dashboard/hydration`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    
    getUserNutritionLens: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/dashboard/nutrition-lens`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default api;
