import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LogsPage.css';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const MealSection = ({ type, logs, onAdd }) => {
    const mealLogs = logs.filter(log => log.meal_type === type);
    const hasLogs = mealLogs.length > 0;

    return (
        <div className="meal-card clay-card">
            <div className="meal-header">
                <div className="meal-title">
                    <span className="material-symbols-outlined meal-icon">
                        {type === 'Breakfast' ? 'light_mode' : 
                         type === 'Lunch' ? 'sunny' : 
                         type === 'Dinner' ? 'dark_mode' : 'cookie'}
                    </span>
                    <h3>{type}</h3>
                </div>
                <button className="add-btn clay-btn" onClick={() => onAdd(type)}>
                    <span className="material-symbols-outlined">add</span>
                    Add
                </button>
            </div>
            
            <div className="meal-logs">
                {hasLogs ? (
                    mealLogs.map(log => (
                        <div key={log.id} className="log-item">
                            <div className="log-info">
                                <p className="log-name">{log.food}</p>
                                <p className="log-details">{log.portion} • {log.calories} kcal</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-logs">
                        <span className="material-symbols-outlined">restaurant</span>
                        <p>Nothing logged yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCalories, setTotalCalories] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await api.getDashboardFoodLogs();
                setLogs(data);
                const total = data.reduce((sum, log) => sum + log.calories, 0);
                setTotalCalories(total);
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const handleAdd = (mealType) => {
        // Navigate to scan page or open a modal
        navigate('/scan', { state: { mealType } });
    };

    if (loading) {
        return <div className="logs-page loading">Loading your logs...</div>;
    }

    const today = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="logs-page">
            <header className="logs-header">
                <div className="header-top">
                    <h1 className="page-title">Daily Log</h1>
                    <button className="calendar-btn clay-btn">
                        <span className="material-symbols-outlined">calendar_today</span>
                    </button>
                </div>
                <div className="date-display">
                    <span className="material-symbols-outlined">calendar_month</span>
                    <p>{today}</p>
                </div>
            </header>

            <div className="meal-sections">
                {MEAL_TYPES.map(type => (
                    <MealSection 
                        key={type} 
                        type={type} 
                        logs={logs} 
                        onAdd={handleAdd} 
                    />
                ))}
            </div>

            <div className="logs-footer">
                <button className="log-day-btn clay-btn">
                    <span className="material-symbols-outlined">check_circle</span>
                    Log Day Entry
                </button>
                <p className="footer-summary">Total: {totalCalories} kcal logged for today</p>
            </div>
        </div>
    );
}
