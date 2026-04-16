import axios from 'axios';

const PC_IP = window.location.hostname || "127.0.0.1"; 
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

    getSystemLenses: async () => {
        const response = await axios.get(`${API_URL}/lenses/system`);
        return response.data;
    },

    getTodaysLogs: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/logs/today`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getRecentLogs: async () => {
        const data = await api.getTodaysLogs();
        return data.logs || [];
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

    logCustomMeal: async (mealData) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/logs/consume`, {
            product_name: mealData.name,
            calories: mealData.calories,
            protein_g: mealData.protein,
            carbs_g: mealData.carbs,
            fat_g: mealData.fat,
            meal_type: mealData.type,
            serving_size: 1.0
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

    // --- Grocery List Endpoints ---
    generateGroceryList: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/smart-cart/generate-from-plan`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getGroceryList: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/smart-cart/list`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateGroceryItemStatus: async (itemId, status) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.patch(`${API_URL}/smart-cart/item/${itemId}?status=${status}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    aiBuddyChat: async (message) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/ai-buddy/chat`, { message }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getAiHistory: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/ai-buddy/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    analyzeAiMeal: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/ai-buddy/analyze-meal`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getAiRecommendations: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/ai-buddy/recommendations`, {
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
    },

    logScan: async (barcode, productName) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/dashboard/log-scan`, {
            barcode,
            product_name: productName
        }, {
            headers: { Authorization: `Bearer ${token}` },
            params: { barcode, product_name: productName } // The backend expects them as query params based on the signature @router.post("/log-scan")
        });
        return response.data;
    },

    // --- Meal Cart Endpoints ---
    getMealPlan: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/meals/weekly`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getMealGroceries: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/meals/groceries`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    setupMealPlan: async (config) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/meals/generate-weekly`, config, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getMealTemplates: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/meals/templates`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // --- Generic Helpers ---
    get: async (endpoint) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // --- Admin Endpoints ---
    getAdminUsers: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getAdminUserDetails: async (userId) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getAdminAnalytics: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/admin/analytics/overview`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getAdminLenses: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/admin/lenses`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    createAdminLens: async (lensData) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/admin/lenses`, lensData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateAdminLens: async (lensId, lensData) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.put(`${API_URL}/admin/lenses/${lensId}`, lensData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    deleteAdminLens: async (lensId) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.delete(`${API_URL}/admin/lenses/${lensId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getAdminProducts: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/admin/products`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    createAdminProduct: async (productData) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/admin/products`, productData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    deleteAdminProduct: async (barcode) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.delete(`${API_URL}/admin/products/${barcode}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getAdminMeals: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/admin/meals/templates`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    createAdminMealTemplate: async (templateData) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/admin/meals/templates`, templateData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getAdminAiConversations: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/admin/ai/conversations`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    post: async (endpoint, data) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}${endpoint}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default api;
