import React, { useState, useEffect } from 'react';
import { ConversionResult } from '../types';
import { convertCurrency } from '../services/geminiService';
import { SwitchHorizontalIcon, WalletIcon, SparklesIcon } from '../components/Icons';

const commonCurrencies = [
    'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR'
];


const Converter: React.FC = () => {
    const [amount, setAmount] = useState('100');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [result, setResult] = useState<ConversionResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSwapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        if (fromCurrency === toCurrency) {
            setError('Please select different currencies.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const conversion = await convertCurrency(numericAmount, fromCurrency, toCurrency);
            setResult(conversion);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-[var(--bg-card)] backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/10 no-print">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-1 text-white">AI Currency Converter</h2>
                    <p className="text-gray-400">Get real-time exchange rates powered by AI.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                        <div className="sm:col-span-2">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                            <div className="relative">
                                <WalletIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="number"
                                    id="amount"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition"
                                    placeholder="100"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="from" className="block text-sm font-medium text-gray-300 mb-1">From</label>
                            <select id="from" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} className="w-full py-2.5 px-2 bg-white/5 border border-white/10 rounded-lg focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition">
                                {commonCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="flex justify-center items-end h-full pb-2">
                            <button type="button" onClick={handleSwapCurrencies} className="p-2 rounded-full hover:bg-white/10 text-gray-300 transition">
                               <SwitchHorizontalIcon className="w-5 h-5"/>
                            </button>
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="to" className="block text-sm font-medium text-gray-300 mb-1">To</label>
                            <select id="to" value={toCurrency} onChange={e => setToCurrency(e.target.value)} className="w-full py-2.5 px-2 bg-white/5 border border-white/10 rounded-lg focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition">
                                {commonCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center bg-gradient-to-r from-[var(--accent-gradient-from)] to-[var(--accent-gradient-to)] text-white font-semibold py-3 px-4 rounded-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] transition-all duration-300 transform hover:scale-105 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed disabled:scale-100 disabled:brightness-100">
                             <SparklesIcon className="w-5 h-5 mr-2" />
                            {isLoading ? 'Converting...' : 'Convert'}
                        </button>
                    </div>
                </form>
                
                {error && <div className="mt-6 bg-red-900/50 border-l-4 border-red-500 text-red-200 p-3 rounded-md text-sm" role="alert"><p>{error}</p></div>}
                
                {result && !isLoading && (
                     <div className="mt-6 p-4 bg-black/20 rounded-lg border border-white/10 text-center">
                        <p className="text-lg font-medium text-gray-300">
                            {parseFloat(amount).toLocaleString()} {fromCurrency} = 
                        </p>
                        <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-gradient-from)] to-[var(--accent-gradient-to)] my-2">
                            {result.convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})} {result.targetCurrency}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            Exchange Rate: 1 {fromCurrency} ≈ {result.exchangeRate.toFixed(4)} {result.targetCurrency}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Converter;
