import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function DietCalendar() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Generate a quick array of the last 5 days
    const days = [];
    const today = new Date();
    for (let i = 4; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push({
            date: d.toISOString().split('T')[0],
            dayNum: d.getDate(),
            dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
            // Mock status for now to match UI (green/orange)
            status: i % 3 === 0 ? 'Deviation' : 'On Target'
        });
    }

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const data = await api.getDashboardHistory(selectedDate);
                setHistoryData(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [selectedDate]);

    return (
        <div className="clay-card-light dark:clay-card-dark rounded-clay p-6 md:p-8 flex flex-col w-full drift" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl tracking-tight">History</h3>
                <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6 px-2">
                {days.map((dayObj, idx) => {
                    const isSelected = dayObj.date === selectedDate;
                    const statusColor = dayObj.status === 'On Target' ? 'bg-primary' : 'bg-amber-500';
                    const selectedStyle = isSelected ? `${statusColor} text-background-dark shadow-lg` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800';

                    return (
                        <div 
                            key={idx} 
                            className="flex flex-col items-center gap-2 cursor-pointer"
                            onClick={() => setSelectedDate(dayObj.date)}
                        >
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">{dayObj.dayName}</span>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all duration-300 ${selectedStyle}`}>
                                {dayObj.dayNum}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 pb-2">
                {loading ? (
                     <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4"></div>
                ) : historyData ? (
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-primary-glow"></span>
                            <span>On Target</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-amber"></span>
                            <span>Deviation</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-slate-500">No data for this date.</p>
                )}
            </div>
        </div>
    );
}
