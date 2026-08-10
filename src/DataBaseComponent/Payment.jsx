import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { objContext } from '../App';
import DashboardLayout from './DashboardLayout';

const Payment = () => {
    const { userCred, serverRoute, setUserPlan } = useContext(objContext);

    const navigate = useNavigate();
    
    useEffect(() => {
        if (!userCred) {
            navigate('/signin');
        }
    }, [userCred, navigate]);
    
    const [selectedPlan, setSelectedPlan] = useState('standard'); 
    const [isProcessing, setIsProcessing] = useState(false);
    
    
    const [nameOnCard, setNameOnCard] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const planDetails = {
        standard: { name: 'Standard', price: 49 },
        premium: { name: 'Premium', price: 199 }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!nameOnCard || !cardNumber || !expiry || !cvc) {
            alert("Please fill in all card details to proceed.");
            return;
        }

        setIsProcessing(true);

        try {
            const amount = planDetails[selectedPlan].price;
            
            const response = await axios.post(`${serverRoute}/upgradePlan`, {
                user_id: userCred.id,
                plan_name: selectedPlan,
                amount: amount
            });
            
            if (response.status === 200) {
                
                setUserPlan(prev => ({
                    ...prev,
                    Plan_Name: selectedPlan,
                    plan_price: amount,
                    Ram: selectedPlan === 'premium' ? 32 : 8,
                    Cloud_Storage: selectedPlan === 'premium' ? 100000 : 10000,
                    Highest_Project: selectedPlan === 'premium' ? 9999 : 10,
                    Highest_CLusters: selectedPlan === 'premium' ? 9999 : 20
                }));
                
                alert(`Success! Upgraded to ${planDetails[selectedPlan].name} Tier.`);
                navigate('/billing');
            }
        } catch (error) {
            console.error(error);
            alert("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto py-10">
                <div className="mb-10 flex items-center gap-4 cursor-pointer" onClick={() => navigate(-1)}>
                    <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">arrow_back</span>
                    <h1 className="text-display-sm text-3xl font-extrabold tracking-tight text-on-surface">Upgrade Plan</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-7 space-y-8">
                        <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                            <h2 className="text-xl font-bold mb-6 text-on-surface">1. Select Tier</h2>
                            <div className="space-y-4">
                                <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${selectedPlan === 'standard' ? 'border-primary bg-surface-container-highest' : 'border-black/5 dark:border-white/5 bg-surface hover:border-primary'}`}>
                                    <input 
                                        type="radio" 
                                        name="plan" 
                                        value="standard" 
                                        className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                                        checked={selectedPlan === 'standard'}
                                        onChange={() => setSelectedPlan('standard')}
                                    />
                                    <div className="ml-4 flex-1">
                                        <h3 className="font-bold text-on-surface">Standard Tier</h3>
                                        <p className="text-sm text-on-surface-variant mt-1">Perfect for growing startups and production apps.</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-on-surface">$49</p>
                                        <p className="text-xs text-on-surface-variant">/mo</p>
                                    </div>
                                </label>

                                <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${selectedPlan === 'premium' ? 'border-primary bg-surface-container-highest' : 'border-black/5 dark:border-white/5 bg-surface hover:border-primary'}`}>
                                    <input 
                                        type="radio" 
                                        name="plan" 
                                        value="premium" 
                                        className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                                        checked={selectedPlan === 'premium'}
                                        onChange={() => setSelectedPlan('premium')}
                                    />
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-on-surface">Premium Tier</h3>
                                            <span className="text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded uppercase font-bold tracking-wider">Enterprise</span>
                                        </div>
                                        <p className="text-sm text-on-surface-variant mt-1">Dedicated resources with 24/7 priority support.</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-on-surface">$199</p>
                                        <p className="text-xs text-on-surface-variant">/mo</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                            <h2 className="text-xl font-bold mb-6 text-on-surface">2. Payment Details</h2>
                            <form className="space-y-6" onSubmit={handlePayment}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">Name on Card</label>
                                    <input 
                                        type="text" 
                                        value={nameOnCard}
                                        onChange={(e) => setNameOnCard(e.target.value)}
                                        placeholder="John Doe" 
                                        className="w-full p-4 bg-surface-container border border-black/5 dark:border-white/5 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">Card Number</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            placeholder="0000 0000 0000 0000" 
                                            className="w-full p-4 pl-12 bg-surface-container border border-black/5 dark:border-white/5 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono"
                                        />
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">credit_card</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">Expiry</label>
                                        <input 
                                            type="text" 
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                            placeholder="MM/YY" 
                                            className="w-full p-4 bg-surface-container border border-black/5 dark:border-white/5 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">CVC</label>
                                        <input 
                                            type="text" 
                                            value={cvc}
                                            onChange={(e) => setCvc(e.target.value)}
                                            placeholder="123" 
                                            className="w-full p-4 bg-surface-container border border-black/5 dark:border-white/5 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="md:col-span-5">
                        <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5 sticky top-10">
                            <h3 className="font-bold text-lg mb-6">Order Summary</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-on-surface-variant">Selected Plan</span>
                                    <span className="font-bold text-on-surface capitalize">{planDetails[selectedPlan].name} Tier</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-on-surface-variant">Billing Cycle</span>
                                    <span className="font-medium text-on-surface">Monthly</span>
                                </div>
                                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                                    <span className="font-bold text-on-surface">Total Due Today</span>
                                    <span className="text-2xl font-black text-primary">${planDetails[selectedPlan].price}.00</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className={`w-full py-4 rounded-xl font-bold transition-all shadow-md flex justify-center items-center gap-2 ${isProcessing ? 'bg-surface-container-highest0 cursor-not-allowed text-white' : 'bg-primary hover:bg-primary/90 text-on-primary hover:shadow-lg'}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">refresh</span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">lock</span>
                                        Pay ${planDetails[selectedPlan].price}.00
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-on-surface-variant mt-4 flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">verified</span>
                                Payments are securely processed internally.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Payment;
