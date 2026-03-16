import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

export default function NutritionTrendChart() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getDashboardWeeklyStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching weekly stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="clay-card-light dark:clay-card-dark rounded-clay p-6 w-full h-64 animate-pulse"></div>;
    }

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
                    <p className="font-black text-sm mb-1">{label}</p>
                    <p className="text-primary font-bold">{`${payload[0].value} kcal`}</p>
                </div>
            );
        }
        return null;
    };
    return (
        <div className="clay-card-dark clay-card-glow rounded-[1.5rem] p-5 shadow-clay flex flex-col w-full h-[220px] drift border-emerald-500/10" style={{ animationDelay: '0.6s' }}>
            <h3 className="font-black text-base mb-4 uppercase tracking-tight text-white">Weekly Nutrition</h3>
            <div className="w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={stats}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} 
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
                        <Bar 
                            dataKey="calories" 
                            fill="#10b981" 
                            radius={[6, 6, 0, 0]} 
                            barSize={32}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
