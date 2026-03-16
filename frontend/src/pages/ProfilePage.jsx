import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeLensName, setActiveLensName] = useState('Muscle Build'); // Default fallback
    const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('profilePhoto') || null);

    const [formData, setFormData] = useState({
        age_years: '',
        weight_kg: '',
        height_cm: '',
        gender: 'Male',
        diet_type: '',
        allergies: '',
        intolerances: '',
        conditions: '',
        medications: '',
        medical_history: '',
        health_goal: ''
    });

    useEffect(() => {
        // Force dark mode on this page
        document.documentElement.classList.add('dark');
        
        const fetchProfileAndLens = async () => {
            try {
                const data = await api.getProfile();
                setProfile(data);
                setFormData({
                    age_years: data.age_years || '',
                    weight_kg: data.weight_kg || '',
                    height_cm: data.height_cm || '',
                    gender: data.gender || 'Male',
                    diet_type: data.diet_type || '',
                    allergies: data.allergies || '',
                    intolerances: data.intolerances || '',
                    conditions: data.conditions || '',
                    medications: data.medications || '',
                    medical_history: data.medical_history || '',
                    health_goal: data.health_goal || ''
                });

                // Get Active Lens Name
                const activeId = localStorage.getItem('activeLensId');
                if (activeId) {
                    if (['muscle_build', 'fat_loss', 'diabetes_friendly', 'athlete_performance', 'clean_eating'].includes(activeId)) {
                        setActiveLensName(activeId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
                    } else {
                        // It's a custom lens ID, try to fetch its name
                        const customLenses = await api.getCustomLenses();
                        const myLens = customLenses.find(l => l.id.toString() === activeId.toString());
                        if (myLens) setActiveLensName(myLens.name);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile", error);
                if (error.response?.status === 401) {
                    navigate('/auth');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndLens();
    }, [navigate]);

    const handleSave = async () => {
        try {
            const updatePayload = {
                ...formData,
                age_years: formData.age_years ? parseInt(formData.age_years) : null,
                weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
                height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
            };
            const updatedProfile = await api.updateProfile(updatePayload);
            setProfile(updatedProfile);
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving profile", error);
            alert("Failed to save profile. Ensure all required fields for BMR (Age, Weight, Height, Gender) are filled out properly.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="text-center p-10 mt-20">Loading Profile...</div>;

    const emailPrefix = profile?.email ? profile.email.split('@')[0] : 'User';

    const getAvatarSrc = () => {
        if (profilePhoto) return profilePhoto;
        return formData.gender === 'Female' 
            ? 'https://avatar.iran.liara.run/public/girl' 
            : 'https://avatar.iran.liara.run/public/boy';
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result);
                localStorage.setItem('profilePhoto', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen pb-24">
            {/* Header */}
            <header className="flex items-center justify-between p-4 sticky top-0 bg-background-dark/80 backdrop-blur-md z-10">
                <button onClick={() => navigate('/dashboard')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/50 text-slate-100 shadow-clay-sm border border-white/10 active:scale-95">
                    <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
                </button>
                <h1 className="text-lg font-extrabold tracking-tight text-primary">PROFILE</h1>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/50 text-slate-100 shadow-clay-sm border border-white/10 active:scale-95 relative">
                    <span className="material-symbols-outlined text-sm">notifications</span>
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-amber rounded-full border border-background-dark"></span>
                </button>
            </header>

            <main className="px-5 space-y-6">
                {/* User Header */}
                <section className="flex flex-col items-center gap-3 py-2">
                    <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary to-accent-amber shadow-clay-md group">
                        <div className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-background-dark" data-alt="Professional portrait" style={{ backgroundImage: `url("${getAvatarSrc()}")` }}>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-primary p-2 rounded-full shadow-lg border-4 border-background-dark">
                            <span className="material-symbols-outlined text-background-dark text-sm leading-none">verified</span>
                        </div>
                        {isEditing && (
                            <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                            </label>
                        )}
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold">{emailPrefix}</h2>
                        <p className="text-slate-400 text-sm font-medium">NutriLens Pro Member</p>
                    </div>
                    
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="bg-primary text-background-dark shadow-clay-primary font-bold transition-transform active:scale-95 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                            <span>Edit Profile</span>
                        </button>
                    ) : (
                        <button onClick={handleSave} className="bg-primary text-background-dark shadow-clay-primary font-bold transition-transform active:scale-95 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            <span>Save Profile</span>
                        </button>
                    )}
                </section>

                {/* Editable Form or Metrics Container */}
                {isEditing ? (
                    <section className="bg-clay-surface shadow-clay-md border border-white/5 rounded-2xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-primary mb-4">Edit Demographics & Medical</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-400 mb-1">Age</label>
                                <input type="number" name="age_years" value={formData.age_years} onChange={handleChange} className="bg-background-dark text-white rounded p-2 border border-white/10" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-400 mb-1">Weight (kg)</label>
                                <input type="number" name="weight_kg" value={formData.weight_kg} onChange={handleChange} className="bg-background-dark text-white rounded p-2 border border-white/10" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-400 mb-1">Height (cm)</label>
                                <input type="number" name="height_cm" value={formData.height_cm} onChange={handleChange} className="bg-background-dark text-white rounded p-2 border border-white/10" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-400 mb-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="bg-background-dark text-white rounded p-2 border border-white/10">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3 mt-4">
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-400 mb-1">Diet Type</label>
                                <input type="text" name="diet_type" value={formData.diet_type} onChange={handleChange} className="bg-background-dark text-white rounded p-2 border border-white/10" placeholder="E.g., Vegan, Keto..." />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-400 mb-1">Allergies</label>
                                <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} className="bg-background-dark text-white rounded p-2 border border-white/10" placeholder="E.g., Peanuts, Dairy..." />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-400 mb-1">Intolerances</label>
                                <input type="text" name="intolerances" value={formData.intolerances} onChange={handleChange} className="bg-background-dark text-white rounded p-2 border border-white/10" placeholder="E.g., Lactose, Gluten..." />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-400 mb-1">Pre-existing Conditions</label>
                                <input type="text" name="conditions" value={formData.conditions} onChange={handleChange} className="bg-background-dark text-white rounded p-2 border border-white/10" placeholder="E.g., Hypertension..." />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-400 mb-1">Current Medications</label>
                                <input type="text" name="medications" value={formData.medications} onChange={handleChange} className="bg-background-dark text-white rounded p-2 border border-white/10" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-400 mb-1">Medical History</label>
                                <textarea name="medical_history" value={formData.medical_history} onChange={handleChange} className="bg-background-dark text-white rounded p-2 border border-white/10" rows="3" />
                            </div>
                        </div>
                    </section>
                ) : (
                    <>
                        {/* Metrics Grid */}
                        <section className="grid grid-cols-3 gap-4">
                            <div className="bg-clay-surface shadow-clay-md border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-primary">calendar_today</span>
                                <span className="text-lg font-bold">{profile?.age_years || '--'} yrs</span>
                                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Age</span>
                            </div>
                            <div className="bg-clay-surface shadow-clay-md border-b-2 border-b-accent-amber/30 rounded-2xl p-4 flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-accent-amber">fitness_center</span>
                                <span className="text-lg font-bold">{profile?.weight_kg || '--'} kg</span>
                                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Weight</span>
                            </div>
                            <div className="bg-clay-surface shadow-clay-md border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-primary">straighten</span>
                                <span className="text-lg font-bold">{profile?.height_cm || '--'} cm</span>
                                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Height</span>
                            </div>
                        </section>

                        {/* Current Lens Section */}
                        <section>
                            <div onClick={() => navigate('/user-lens')} className="bg-clay-surface shadow-[inset_2px_2px_5px_rgba(255,255,255,0.05),_4px_4px_10px_rgba(0,0,0,0.5)] border border-white/5 rounded-2xl p-5 relative overflow-hidden group cursor-pointer border-l-4 border-l-primary hover:bg-white/5 active:scale-[0.98] transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="space-y-1 z-10">
                                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Active AI Lens</span>
                                        <h3 className="text-xl font-black capitalize text-slate-100">{activeLensName}</h3>
                                    </div>
                                    <span className="material-symbols-outlined text-primary text-3xl z-10">psychology</span>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed mb-3 z-10 relative">
                                    Your food scans are currently being evaluated through this specific perspective. BMR: {profile?.bmr ? `${profile.bmr} kcal/d` : '--'}
                                </p>
                                <div className="flex items-center justify-between pt-3 border-t border-white/5 z-10 relative">
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Change Lens in Gallery</span>
                                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
                            </div>
                        </section>
                        
                        {/* Medical Overview Section (Read-only) */}
                        <section className="bg-clay-surface shadow-clay-md border border-white/5 rounded-2xl p-6 space-y-4">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Medical Profile</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-slate-400 block text-xs">Diet Type</span>{profile?.diet_type || 'None specifies'}</div>
                                <div><span className="text-slate-400 block text-xs">Allergies</span>{profile?.allergies || 'None'}</div>
                                <div><span className="text-slate-400 block text-xs">Intolerances</span>{profile?.intolerances || 'None'}</div>
                                <div><span className="text-slate-400 block text-xs">Conditions</span>{profile?.conditions || 'None'}</div>
                            </div>
                        </section>
                    </>
                )}

                {/* Footer Actions */}
                <section className="grid grid-cols-2 gap-3 pb-8">
                    <div className="bg-clay-surface shadow-clay-sm border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-white/5 active:scale-95 transition-all text-center">
                        <div className="p-2 bg-slate-700/50 rounded-lg">
                            <span className="material-symbols-outlined text-slate-300 text-[20px]">shield_lock</span>
                        </div>
                        <span className="font-bold text-sm">Privacy</span>
                    </div>
                    <div onClick={() => { localStorage.clear(); navigate('/auth'); }} className="bg-clay-surface shadow-clay-sm border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-red-500/10 active:scale-95 transition-all text-center">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <span className="material-symbols-outlined text-red-500 text-[20px]">logout</span>
                        </div>
                        <span className="font-bold text-red-200 text-sm">Sign Out</span>
                    </div>
                </section>
            </main>

        </div>
    );
}
