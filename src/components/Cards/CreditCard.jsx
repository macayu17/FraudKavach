import React from 'react';
import { Wifi, Snowflake } from 'lucide-react';
import visaLogo from '../../assets/visa-logo.png';

const CreditCard = ({ card, frozen }) => {
    const formattedNumber = card.card_number.match(/.{1,4}/g).join(' ');

    const getGradient = (color) => {
        switch (color) {
            case 'visa-gold':
                return 'bg-gradient-to-br from-[#dbb46c] via-[#f5e2ad] to-[#b88a44]';
            case 'visa-black':
                return 'bg-gradient-to-br from-[#2b2b2b] via-[#4a4a4a] to-[#1a1a1a]';
            case 'visa-blue':
            default:
                return 'bg-gradient-to-br from-[#1a4c9e] via-[#2f6fd6] to-[#0d2d6c]';
        }
    };

    const bgClass = getGradient(card.color);
    // Use white text for all for better contrast on these gradients, or dark on gold
    const textColor = card.color === 'visa-gold' ? 'text-yellow-900' : 'text-white';
    const labelColor = card.color === 'visa-gold' ? 'text-yellow-900/60' : 'text-white/60';
    const borderColor = card.color === 'visa-gold' ? 'border-[#b88a44]/30' : 'border-white/10';
    const chipColor = 'from-[#faeeb1] via-[#e8c06e] to-[#c79836]';

    return (
        <div className="group w-96 h-56 perspective-1000 cursor-pointer font-sans select-none">
            <div className={`relative w-full h-full duration-700 preserve-3d group-hover:rotate-y-180 transition-transform ease-out ${frozen ? 'grayscale opacity-80' : ''}`}>

                {/* ================= FRONT FACE ================= */}
                <div className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-2xl ${bgClass} overflow-hidden border ${borderColor}`}>

                    {/* --- Effects --- */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                    {/* Shine */}
                    <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-shine pointer-events-none transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col justify-between h-full p-7">

                        {/* Top: Chip & Wifi */}
                        <div className="flex justify-between items-start">
                            {/* Realistic EMV Chip SVG */}
                            <svg width="45" height="45" viewBox="0 0 60 45" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                                <rect width="60" height="45" rx="6" fill="url(#chipNewGradient)" />
                                <path d="M0 22.5H60" stroke="#8B6C28" strokeWidth="0.5" strokeOpacity="0.6" />
                                <path d="M20 0V45" stroke="#8B6C28" strokeWidth="0.5" strokeOpacity="0.6" />
                                <path d="M40 0V45" stroke="#8B6C28" strokeWidth="0.5" strokeOpacity="0.6" />
                                <rect x="15" y="12" width="30" height="21" rx="4" stroke="#8B6C28" strokeWidth="0.5" strokeOpacity="0.6" />
                                <defs>
                                    <linearGradient id="chipNewGradient" x1="0" y1="0" x2="60" y2="45" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#F9EFB6" />
                                        <stop offset="0.5" stopColor="#D4A74F" />
                                        <stop offset="1" stopColor="#B68B34" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <Wifi className={`rotate-90 opacity-80 ${textColor}`} size={28} />
                        </div>

                        {/* Mid: Number */}
                        <div className="mt-1">
                            <div className={`text-[22px] font-mono tracking-[0.15em] font-medium ${textColor}`}
                                style={{ textShadow: '0px 1px 1px rgba(0,0,0,0.3)' }}>
                                {formattedNumber}
                            </div>
                        </div>

                        {/* Bottom: Info & Visa Logo */}
                        <div className="flex justify-between items-end">
                            <div className="flex gap-6">
                                <div>
                                    <div className={`text-[8px] uppercase tracking-widest font-bold mb-0.5 ${labelColor}`}>Card Holder</div>
                                    <div className={`font-bold tracking-wider text-xs uppercase ${textColor} truncate max-w-[120px]`}>
                                        {card.card_holder || 'VALUED MEMBER'}
                                    </div>
                                </div>
                                <div>
                                    <div className={`text-[8px] uppercase tracking-widest font-bold mb-0.5 ${labelColor}`}>Expires</div>
                                    <div className={`font-bold tracking-wider text-xs ${textColor}`}>
                                        {card.expiry_date}
                                    </div>
                                </div>
                            </div>

                            {/* Visa Logo */}
                            <img src={visaLogo} alt="Visa" className="w-16 h-auto object-contain drop-shadow-md" />
                        </div>
                    </div>
                </div>

                {/* ================= BACK FACE ================= */}
                <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl shadow-2xl ${bgClass} overflow-hidden border ${borderColor} flex flex-col`}>
                    <div className="absolute inset-0 bg-black/5"></div>

                    {/* Magnetic Strip */}
                    <div className="w-full h-12 bg-[#1a1a1a] mt-6 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    </div>

                    <div className="px-8 flex-1 flex flex-col justify-center relative z-10">
                        <div className="flex justify-end items-center gap-3">
                            <div className="text-[8px] uppercase font-bold opacity-60">CVV</div>
                            <div className="bg-white/90 text-black font-mono px-3 py-1 rounded-sm text-sm font-bold shadow-inner transform -skew-x-12 min-w-[3rem] text-center">
                                {card.cvv}
                            </div>
                        </div>

                        <div className={`mt-6 text-[7px] leading-relaxed opacity-60 text-justify ${card.color === 'visa-gold' ? 'text-yellow-900' : 'text-white'}`}>
                            This card is issued by Smart Fintech Bank.
                            Not valid unless signed.
                            <br />AUTHORISED SIGNATURE NOT REQUIRED.
                        </div>
                    </div>

                    <div className="px-6 pb-5 flex justify-between items-end opacity-50">
                        <div className="w-8 h-8 rounded-full border border-current opacity-30"></div>
                        <Wifi className={`rotate-90 ${textColor}`} size={20} />
                    </div>
                </div>

            </div>

            {/* Frozen Warning */}
            {frozen && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-white/10 backdrop-blur-md p-4 px-6 rounded-full border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-pulse">
                        <span className="text-white font-black tracking-[0.3em] flex items-center gap-3 uppercase text-lg drop-shadow-lg">
                            <Snowflake className="animate-spin-slow" size={24} /> Frozen
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreditCard;
