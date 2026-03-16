import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function DietCalendar() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Generate a quick array of the last 7 days
    const days = [];
    const today = new Date();
    for (let i = 4; i >= -2; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push({
            date: d.toISOString().split('T')[0],
            dayNum: d.getDate(),
            dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
            // Mock status for now to match UI (green/orange)
            status: i === 1 ? 'Deviation' : (i > 1 ? 'On Target' : 'None')
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
        <div className="clay-card-dark clay-card-glow rounded-[1.5rem] p-5 flex flex-col w-full drift shadow-clay border-emerald-500/10" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-base tracking-tight text-white">History</h3>
                <div className="flex gap-2">
                    <button className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/5">
                        <span className="material-symbols-outlined text-[12px] font-black pointer-events-none">chevron_left</span>
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/5">
                        <span className="material-symbols-outlined text-[12px] font-black pointer-events-none">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6 px-1 gap-1.5">
                {days.map((dayObj, idx) => {
                    const isToday = dayObj.date === today.toISOString().split('T')[0];
                    let blockStyle = "bg-slate-900 text-slate-500 border border-white/5";
                    if (dayObj.status === 'On Target') blockStyle = "bg-primary text-background-dark shadow-primary-glow";
                    if (dayObj.status === 'Deviation') blockStyle = "bg-amber-500 text-background-dark shadow-amber";
                    
                    return (
                        <div 
                            key={idx} 
                            className="flex-1 flex flex-col items-center gap-2 cursor-pointer"
                            onClick={() => setSelectedDate(dayObj.date)}
                        >
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${isToday ? 'text-primary' : 'text-slate-500'}`}>
                                {dayObj.dayName}
                            </span>
                            <div className={`w-full aspect-square max-w-[32px] rounded-lg flex items-center justify-center text-[11px] font-black transition-all duration-300 ${blockStyle}`}>
                                {dayObj.dayNum}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-primary-glow"></span>
                        <span className="text-[8px] font-black uppercase tracking-tighter text-slate-500">On Target</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-amber"></span>
                        <span className="text-[8px] font-black uppercase tracking-tighter text-slate-500">Deviation</span>
                    </div>
                </div>
                
                {!loading && (
                    <div className="text-right">
                        <p className="text-[11px] font-black leading-tight text-white">{historyData?.calories || 0} kcal</p>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{historyData?.meals?.length || 0} meals</p>
                    </div>
                )}
            </div>
        </div>
    );
}
