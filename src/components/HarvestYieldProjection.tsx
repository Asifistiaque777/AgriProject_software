import React, { useState, useMemo } from 'react';
import { FarmerProfile, LanguageMode } from '../types';
import { getTranslation } from '../utils/translations';
import {
  TrendingUp,
  Calendar,
  Sprout,
  BarChart3,
  CloudSun,
  Droplets,
  Sliders,
  DollarSign,
  Award,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  Layers,
  ArrowUpRight,
  BookmarkPlus
} from 'lucide-react';

interface HarvestYieldProjectionProps {
  farmerProfile?: FarmerProfile;
  farmerName?: string;
  lang: LanguageMode;
  triggerNotificationToast: (msg: string) => void;
  addLog: (msg: string) => void;
}

interface HistoricalYieldRecord {
  year: number;
  season: 'Boro (Spring)' | 'Aman (Autumn)' | 'Rabi (Winter)';
  crop: string;
  acres: number;
  yieldPerAcreKg: number;
  totalHarvestKg: number;
  avgPriceBdtPerKg: number;
  weatherCondition: string;
}

const HISTORICAL_DATA: HistoricalYieldRecord[] = [
  // Boro Rice
  { year: 2023, season: 'Boro (Spring)', crop: 'High-Yield Boro Rice (BRRI-89)', acres: 4.2, yieldPerAcreKg: 3150, totalHarvestKg: 13230, avgPriceBdtPerKg: 32.5, weatherCondition: 'Optimal Rainfall' },
  { year: 2024, season: 'Boro (Spring)', crop: 'High-Yield Boro Rice (BRRI-89)', acres: 4.5, yieldPerAcreKg: 3320, totalHarvestKg: 14940, avgPriceBdtPerKg: 34.0, weatherCondition: 'Mild Heatwave' },
  { year: 2025, season: 'Boro (Spring)', crop: 'High-Yield Boro Rice (BRRI-89)', acres: 4.5, yieldPerAcreKg: 3450, totalHarvestKg: 15525, avgPriceBdtPerKg: 36.5, weatherCondition: 'Balanced Monsoon' },
  
  // Cardinal Red Potatoes
  { year: 2023, season: 'Rabi (Winter)', crop: 'Cardinal Red Potatoes', acres: 2.0, yieldPerAcreKg: 8100, totalHarvestKg: 16200, avgPriceBdtPerKg: 19.5, weatherCondition: 'Cold Winter' },
  { year: 2024, season: 'Rabi (Winter)', crop: 'Cardinal Red Potatoes', acres: 2.5, yieldPerAcreKg: 8450, totalHarvestKg: 21125, avgPriceBdtPerKg: 22.0, weatherCondition: 'Optimal Humidity' },
  { year: 2025, season: 'Rabi (Winter)', crop: 'Cardinal Red Potatoes', acres: 2.5, yieldPerAcreKg: 8800, totalHarvestKg: 22000, avgPriceBdtPerKg: 24.5, weatherCondition: 'Unseasonal Humidity' },

  // Winter Mustard
  { year: 2023, season: 'Rabi (Winter)', crop: 'Winter Mustard (BARI-14)', acres: 1.5, yieldPerAcreKg: 620, totalHarvestKg: 930, avgPriceBdtPerKg: 78.0, weatherCondition: 'Dry Winter' },
  { year: 2024, season: 'Rabi (Winter)', crop: 'Winter Mustard (BARI-14)', acres: 1.5, yieldPerAcreKg: 670, totalHarvestKg: 1005, avgPriceBdtPerKg: 82.0, weatherCondition: 'Optimal Fog' },
  { year: 2025, season: 'Rabi (Winter)', crop: 'Winter Mustard (BARI-14)', acres: 1.8, yieldPerAcreKg: 710, totalHarvestKg: 1278, avgPriceBdtPerKg: 86.0, weatherCondition: 'Cool Winter' },

  // Aman Rice
  { year: 2023, season: 'Aman (Autumn)', crop: 'Aman Paddy (BRRI-75)', acres: 3.8, yieldPerAcreKg: 2800, totalHarvestKg: 10640, avgPriceBdtPerKg: 30.0, weatherCondition: 'Heavy Flood Risk' },
  { year: 2024, season: 'Aman (Autumn)', crop: 'Aman Paddy (BRRI-75)', acres: 4.0, yieldPerAcreKg: 2980, totalHarvestKg: 11920, avgPriceBdtPerKg: 33.0, weatherCondition: 'Good Drainage' },
  { year: 2025, season: 'Aman (Autumn)', crop: 'Aman Paddy (BRRI-75)', acres: 4.0, yieldPerAcreKg: 3120, totalHarvestKg: 12480, avgPriceBdtPerKg: 35.0, weatherCondition: 'Optimal Rain' },
];

export const HarvestYieldProjection: React.FC<HarvestYieldProjectionProps> = ({
  farmerProfile,
  farmerName = "Abul Hasan Miah",
  lang,
  triggerNotificationToast,
  addLog,
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('High-Yield Boro Rice (BRRI-89)');
  const [cultivatedAcres, setCultivatedAcres] = useState<number>(4.5);
  const [weatherScenario, setWeatherScenario] = useState<'OPTIMAL' | 'NORMAL' | 'UNSEASONAL_RAIN' | 'DROUGHT'>('OPTIMAL');
  const [soilInputType, setSoilInputType] = useState<'CONVENTIONAL' | 'NPK_ORGANIC' | 'BIO_STIMULANT'>('NPK_ORGANIC');
  const [irrigationMode, setIrrigationMode] = useState<'RAINFED' | 'AWD_SMART'>('AWD_SMART');
  const [targetSeason, setTargetSeason] = useState<'Boro 2026-27' | 'Aman 2026' | 'Rabi 2026-27'>('Boro 2026-27');
  const [savedProjectionsCount, setSavedProjectionsCount] = useState<number>(0);

  // Filter historical data for selected crop
  const cropHistory = useMemo(() => {
    return HISTORICAL_DATA.filter(item => item.crop === selectedCrop);
  }, [selectedCrop]);

  // Compute 3-year historical average yield per acre for this crop
  const historicalAvgYieldPerAcre = useMemo(() => {
    if (cropHistory.length === 0) return 3000;
    const sum = cropHistory.reduce((acc, curr) => acc + curr.yieldPerAcreKg, 0);
    return Math.round(sum / cropHistory.length);
  }, [cropHistory]);

  const historicalAvgPrice = useMemo(() => {
    if (cropHistory.length === 0) return 35;
    const sum = cropHistory.reduce((acc, curr) => acc + curr.avgPriceBdtPerKg, 0);
    return Math.round((sum / cropHistory.length) * 10) / 10;
  }, [cropHistory]);

  // Projection Calculations
  const projection = useMemo(() => {
    // Weather Multiplier
    let weatherMultiplier = 1.0;
    if (weatherScenario === 'OPTIMAL') weatherMultiplier = 1.07;
    else if (weatherScenario === 'NORMAL') weatherMultiplier = 1.0;
    else if (weatherScenario === 'UNSEASONAL_RAIN') weatherMultiplier = 0.92;
    else if (weatherScenario === 'DROUGHT') weatherMultiplier = 0.88;

    // Soil Input Multiplier
    let soilMultiplier = 1.0;
    if (soilInputType === 'CONVENTIONAL') soilMultiplier = 1.0;
    else if (soilInputType === 'NPK_ORGANIC') soilMultiplier = 1.08;
    else if (soilInputType === 'BIO_STIMULANT') soilMultiplier = 1.15;

    // Irrigation Multiplier
    let irrigationMultiplier = irrigationMode === 'AWD_SMART' ? 1.05 : 1.0;

    // Compound Annual Growth Rate (CAGR) baseline from historic tech improvements (+2.5%/year)
    const techTrendBonus = 1.03;

    // Projected Yield Per Acre
    const projectedYieldPerAcreKg = Math.round(
      historicalAvgYieldPerAcre * weatherMultiplier * soilMultiplier * irrigationMultiplier * techTrendBonus
    );

    const projectedTotalHarvestKg = Math.round(projectedYieldPerAcreKg * cultivatedAcres);
    const projectedTotalMetricTons = (projectedTotalHarvestKg / 1000).toFixed(2);

    // Price Projections (accounting for 5% annual market inflation)
    const projectedPricePerKg = Math.round((historicalAvgPrice * 1.08) * 10) / 10;
    const estimatedGrossRevenueBdt = Math.round(projectedTotalHarvestKg * projectedPricePerKg);
    const lowEstimateBdt = Math.round(estimatedGrossRevenueBdt * 0.92);
    const highEstimateBdt = Math.round(estimatedGrossRevenueBdt * 1.08);

    const yieldDiffPercent = Math.round(((projectedYieldPerAcreKg - historicalAvgYieldPerAcre) / historicalAvgYieldPerAcre) * 100);

    return {
      projectedYieldPerAcreKg,
      projectedTotalHarvestKg,
      projectedTotalMetricTons,
      projectedPricePerKg,
      estimatedGrossRevenueBdt,
      lowEstimateBdt,
      highEstimateBdt,
      yieldDiffPercent,
      weatherMultiplier,
      soilMultiplier,
      irrigationMultiplier
    };
  }, [historicalAvgYieldPerAcre, historicalAvgPrice, cultivatedAcres, weatherScenario, soilInputType, irrigationMode]);

  // Handle Save Projection
  const handleSaveProjection = () => {
    setSavedProjectionsCount(prev => prev + 1);
    const logMessage = `Yield Projection saved for ${selectedCrop} (${cultivatedAcres} acres): Est. ${projection.projectedTotalHarvestKg} kg (৳${projection.estimatedGrossRevenueBdt.toLocaleString()} BDT).`;
    addLog(logMessage);
    triggerNotificationToast(
      lang === 'BN' 
        ? `✅ ${selectedCrop}-এর ফসল কাটার আনুমানিক হিসাব সংরক্ষিত হয়েছে!`
        : `✅ Yield Projection model for ${selectedCrop} saved successfully!`
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-[#1A2A1A]/10 p-6 md:p-8 shadow-sm space-y-8 font-sans">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-[#2D4F1E]/10 text-[#2D4F1E] px-3 py-1 rounded-full text-xs font-extrabold">
            <TrendingUp className="w-4 h-4 text-[#2D4F1E]" />
            <span>{lang === 'BN' ? "ঐতিহাসিক তথ্য ও আবহাওয়া মডেল" : "Historical Data & Seasonal Analytics"}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-[#1A2A1A] tracking-tight">
            {lang === 'BN' ? "📈 পূর্বাভাসযোগ্য শস্য উৎপাদন ও আয় হিসাব" : "Harvest Yield Projection Engine"}
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            {lang === 'BN'
              ? `${farmerName}-এর বিগত ৩ বছরের ফসল ফলনের রেকর্ড, মাটি ও আবহাওয়ার প্যাটার্ন বিশ্লেষণ।`
              : `Seasonal AI predictive model based on 3-year historical field logs for ${farmerName}.`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {savedProjectionsCount > 0 && (
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-2xl flex items-center gap-1 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{savedProjectionsCount} {lang === 'BN' ? "সংরক্ষিত মডেল" : "Saved Models"}</span>
            </span>
          )}
          <button
            onClick={handleSaveProjection}
            className="px-4 py-2.5 bg-[#2D4F1E] hover:bg-[#203a15] text-white font-extrabold text-xs rounded-2xl shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{lang === 'BN' ? "মডেল সংরক্ষণ করুন" : "Save Model Projection"}</span>
          </button>
        </div>
      </div>

      {/* HISTORICAL YIELD PERFORMANCE COMPARISON SUMMARY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-[#1A2A1A] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#2D4F1E]" />
            <span>{lang === 'BN' ? "বিগত বছরের ফসল উৎপাদনের ইতিহাস (২০২৩ - ২০২৫)" : "3-Year Historical Yield Performance"}</span>
          </h4>
          <span className="text-xs text-gray-400 font-bold">{selectedCrop}</span>
        </div>

        {/* Custom SVG Bar Chart comparing 2023, 2024, 2025 and 2026/27 Projected */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            
            {/* 2023 */}
            {cropHistory.map((item) => (
              <div key={item.year} className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-2">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">{item.year} Actual</span>
                <div className="text-lg font-black text-gray-800">{item.yieldPerAcreKg.toLocaleString()} <span className="text-xs text-gray-500 font-normal">kg/acre</span></div>
                <div className="text-[11px] font-bold text-gray-500 bg-gray-100 py-0.5 px-2 rounded-md truncate" title={item.weatherCondition}>
                  🌤️ {item.weatherCondition}
                </div>
              </div>
            ))}

            {/* 2026/27 Projected */}
            <div className="bg-gradient-to-br from-emerald-500 to-[#2D4F1E] text-white p-4 rounded-xl shadow-md space-y-2 relative overflow-hidden">
              <div className="absolute top-1 right-1 bg-amber-400 text-gray-900 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                AI Forecast
              </div>
              <span className="text-[11px] font-black text-emerald-100 uppercase tracking-wider">{targetSeason}</span>
              <div className="text-xl font-black text-white">{projection.projectedYieldPerAcreKg.toLocaleString()} <span className="text-xs text-emerald-200 font-normal">kg/acre</span></div>
              <div className="text-[11px] font-bold text-emerald-100 bg-white/20 py-0.5 px-2 rounded-md">
                {projection.yieldDiffPercent >= 0 ? `+${projection.yieldDiffPercent}%` : `${projection.yieldDiffPercent}%`} {lang === 'BN' ? "গড়ের চেয়ে বেশি" : "vs 3-yr avg"}
              </div>
            </div>

          </div>

          {/* SVG Visual Progress Line */}
          <div className="pt-2">
            <div className="text-[11px] font-bold text-gray-500 mb-2 flex justify-between">
              <span>{lang === 'BN' ? "ফলনের ধারাবাহিক অগ্রগতি ট্র্যাণ্ড:" : "Yield Growth Trend Curve:"}</span>
              <span className="text-[#2D4F1E] font-black">
                {lang === 'BN' ? "ঐতিহাসিক গড়ের চেয়ে +১২% পর্যন্ত বৃদ্ধি সম্ভব" : "+12% Growth Potential with Smart Agronomy"}
              </span>
            </div>
            
            <div className="h-20 w-full relative bg-white rounded-xl border border-gray-200 p-2 flex items-end justify-between px-6">
              {/* Lines grid */}
              <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-gray-200 pointer-events-none" />

              {/* Data Points */}
              {cropHistory.map((item, index) => {
                const maxKg = 10000;
                const heightPct = Math.min(100, Math.max(20, (item.yieldPerAcreKg / maxKg) * 100));
                return (
                  <div key={item.year} className="flex flex-col items-center gap-1 z-10">
                    <span className="text-[10px] font-bold text-gray-600">{item.yieldPerAcreKg} kg</span>
                    <div
                      className="w-8 bg-emerald-600 rounded-t-md transition-all duration-500"
                      style={{ height: `${heightPct * 0.5}px` }}
                    />
                    <span className="text-[10px] font-extrabold text-gray-400">{item.year}</span>
                  </div>
                );
              })}

              {/* Projected Bar */}
              <div className="flex flex-col items-center gap-1 z-10">
                <span className="text-[10px] font-black text-emerald-700">{projection.projectedYieldPerAcreKg} kg</span>
                <div
                  className="w-10 bg-gradient-to-t from-[#2D4F1E] to-emerald-400 rounded-t-md shadow transition-all duration-500 border-2 border-emerald-300"
                  style={{ height: `${Math.min(100, Math.max(20, (projection.projectedYieldPerAcreKg / 10000) * 100)) * 0.5}px` }}
                />
                <span className="text-[10px] font-black text-[#2D4F1E]">Proj.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* INTERACTIVE INPUT CONTROLS GRID */}
      <div className="space-y-4">
        <h4 className="text-sm font-extrabold text-[#1A2A1A] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#F97316]" />
          <span>{lang === 'BN' ? "পূর্বাভাস মডেলের প্যারামিটার সমন্বয় করুন:" : "Adjust Interactive Projection Variables:"}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold">
          
          {/* 1. Crop Selection */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
            <label className="text-gray-700 block flex items-center gap-1.5 font-black">
              <Sprout className="w-4 h-4 text-[#2D4F1E]" />
              <span>{lang === 'BN' ? "ফসল নির্বাচন:" : "Select Crop:"}</span>
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-[#2D4F1E]"
            >
              <option value="High-Yield Boro Rice (BRRI-89)">🌾 Boro Rice (BRRI-89)</option>
              <option value="Cardinal Red Potatoes">🥔 Cardinal Red Potato</option>
              <option value="Winter Mustard (BARI-14)">🌼 Winter Mustard (BARI-14)</option>
              <option value="Aman Paddy (BRRI-75)">🌾 Aman Paddy (BRRI-75)</option>
            </select>
            <p className="text-[11px] text-gray-400 font-normal">
              {lang === 'BN' ? "ঐতিহাসিক ৩ বছরের তথ্য সংযুক্ত" : "Linked to 3-year historical logs"}
            </p>
          </div>

          {/* 2. Cultivated Land Area Slider */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-gray-700 font-black">{lang === 'BN' ? "জমি পরিমাপ (একর):" : "Cultivated Area:"}</label>
              <span className="text-[#2D4F1E] font-black text-sm bg-emerald-100 px-2 py-0.5 rounded-lg">
                {cultivatedAcres} {lang === 'BN' ? "একর" : "Acres"}
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={12.0}
              step={0.5}
              value={cultivatedAcres}
              onChange={(e) => setCultivatedAcres(parseFloat(e.target.value))}
              className="w-full accent-[#2D4F1E] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-normal">
              <span>0.5 Acre</span>
              <span>6.0 Acres</span>
              <span>12.0 Acres</span>
            </div>
          </div>

          {/* 3. Weather Forecast Pattern */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
            <label className="text-gray-700 block flex items-center gap-1.5 font-black">
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span>{lang === 'BN' ? "আবহাওয়া পূর্বাভাস:" : "Seasonal Weather:"}</span>
            </label>
            <select
              value={weatherScenario}
              onChange={(e) => setWeatherScenario(e.target.value as any)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-[#2D4F1E]"
            >
              <option value="OPTIMAL">☀️ Optimal Monsoon (+7% Yield)</option>
              <option value="NORMAL">⛅ Normal Season (Baseline)</option>
              <option value="UNSEASONAL_RAIN">🌧️ High Rain / Blight Risk (-8%)</option>
              <option value="DROUGHT">🔥 Mild Drought / Heat (-12%)</option>
            </select>
            <p className="text-[11px] text-gray-400 font-normal">
              {weatherScenario === 'OPTIMAL' && (lang === 'BN' ? "আদর্শ তাপমাত্রা ও সময়মত বৃষ্টি" : "Ideal sunshine & timely rains")}
              {weatherScenario === 'NORMAL' && (lang === 'BN' ? "স্বাভাবিক আবহাওয়া শর্তাবলী" : "Standard average weather")}
              {weatherScenario === 'UNSEASONAL_RAIN' && (lang === 'BN' ? "অসময়ে অতিরিক্ত আর্দ্রতা ও ছত্রাক ঝুঁকি" : "High humidity late blight threat")}
              {weatherScenario === 'DROUGHT' && (lang === 'BN' ? "খরা ও ভূগর্ভস্থ পানির ঘাটতি" : "Water table stress & high temperature")}
            </p>
          </div>

          {/* 4. Fertilizer & Soil Treatment */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
            <label className="text-gray-700 block flex items-center gap-1.5 font-black">
              <Droplets className="w-4 h-4 text-sky-600" />
              <span>{lang === 'BN' ? "সার ও প্রযুক্তি:" : "Soil & Inputs:"}</span>
            </label>
            <select
              value={soilInputType}
              onChange={(e) => setSoilInputType(e.target.value as any)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-[#2D4F1E]"
            >
              <option value="CONVENTIONAL">Standard Fertilizer (Baseline)</option>
              <option value="NPK_ORGANIC">DAE NPK + Organic Compost (+8%)</option>
              <option value="BIO_STIMULANT">Hydro-Mulch + Bio-Stimulant (+15%)</option>
            </select>
            <div className="flex items-center gap-2 pt-1">
              <label className="inline-flex items-center gap-1 text-[11px] text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={irrigationMode === 'AWD_SMART'}
                  onChange={(e) => setIrrigationMode(e.target.checked ? 'AWD_SMART' : 'RAINFED')}
                  className="rounded text-[#2D4F1E] focus:ring-[#2D4F1E]"
                />
                <span>AWD Smart Irrigation (+5%)</span>
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* PROJECTION OUTPUT METRICS CARDS */}
      <div className="bg-gradient-to-br from-[#1A3816] via-[#2D4F1E] to-[#122410] text-white p-6 md:p-8 rounded-3xl shadow-lg space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{targetSeason} Projected Forecast Summary</span>
            </div>
            <h4 className="text-2xl font-black text-white">
              {lang === 'BN' ? "সম্ভাব্য মোট ফসল ও বাজার মূল্য" : "Projected Total Yield & Financial Revenue"}
            </h4>
          </div>

          <div className="bg-white/10 px-4 py-2 rounded-2xl text-right shrink-0">
            <span className="text-[10px] text-gray-300 font-bold uppercase block">Target Season</span>
            <span className="text-xs font-black text-amber-300">{selectedCrop}</span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Projected Harvest */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1">
              <Sprout className="w-4 h-4" />
              {lang === 'BN' ? "সম্ভাব্য মোট ফলন" : "Estimated Harvest"}
            </span>
            <div className="text-2xl md:text-3xl font-black text-white">
              {projection.projectedTotalHarvestKg.toLocaleString()} <span className="text-sm font-semibold text-emerald-200">kg</span>
            </div>
            <p className="text-[11px] text-gray-300 font-medium">
              = {projection.projectedTotalMetricTons} {lang === 'BN' ? "মেট্রিক টন" : "Metric Tons"}
            </p>
          </div>

          {/* Yield Density */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              {lang === 'BN' ? "একর প্রতি গড় ফলন" : "Yield Density"}
            </span>
            <div className="text-2xl md:text-3xl font-black text-white">
              {projection.projectedYieldPerAcreKg.toLocaleString()} <span className="text-sm font-semibold text-emerald-200">kg/acre</span>
            </div>
            <p className="text-[11px] text-amber-300 font-extrabold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {projection.yieldDiffPercent >= 0 ? `+${projection.yieldDiffPercent}%` : `${projection.yieldDiffPercent}%`} vs historical
            </p>
          </div>

          {/* Estimated Gross Market Value */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {lang === 'BN' ? "আনুমানিক বাজার মূল্য" : "Estimated Gross Value"}
            </span>
            <div className="text-2xl md:text-3xl font-black text-amber-300">
              ৳{projection.estimatedGrossRevenueBdt.toLocaleString()}
            </div>
            <p className="text-[11px] text-gray-300 font-medium">
              @ ৳{projection.projectedPricePerKg}/kg average
            </p>
          </div>

          {/* Value Band Range */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1">
              <Award className="w-4 h-4" />
              {lang === 'BN' ? "বাজার ওঠানামা রেঞ্জ" : "Revenue Confidence Band"}
            </span>
            <div className="text-sm font-black text-white pt-1">
              ৳{(projection.lowEstimateBdt / 1000).toFixed(0)}k - ৳{(projection.highEstimateBdt / 1000).toFixed(0)}k <span className="text-xs text-gray-300 font-normal">BDT</span>
            </div>
            <p className="text-[11px] text-gray-300 font-medium pt-1">
              {lang === 'BN' ? "বাজারের চাহিদা ও মান ভেদে ±৮% ব্যবধান" : "±8% volatility band based on grade"}
            </p>
          </div>

        </div>

        {/* AI AGRONOMIST STRATEGIC RECOMMENDATIONS */}
        <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs">
            <Lightbulb className="w-4 h-4" />
            <span>{lang === 'BN' ? "স্মার্টফার্মার এআই এগ্রোনোমিস্ট পর্যবেক্ষণ:" : "SmartFarmer AI Agronomist Insights & Seasonal Tips:"}</span>
          </div>
          <ul className="text-xs text-gray-200 space-y-1.5 list-disc list-inside font-medium leading-relaxed">
            {selectedCrop.includes('Boro') && (
              <>
                <li>{lang === 'BN' ? "সরিষা কাটার পর বিআরআরআই-৮৯ রোপণ করলে মাটিতে নাইট্রোজেনের ঘাটতি দূর হয় এবং সার খরচ ৳৪,৫০০/একর কমে।" : "Rotating BRRI-89 Boro Rice post-mustard harvest retains residual leguminous Nitrogen, saving ~৳4,500/acre in Urea fertilizer."}</li>
                <li>{lang === 'BN' ? "AWD সেচ পদ্ধতি ব্যবহারের ফলে পানি ২৫% সাশ্রয় হয় এবং জিংক ও পটাশ শোষণ ক্ষমতা বৃদ্ধি পায়।" : "AWD (Alternate Wetting and Drying) drip scheduling reduces diesel pump fuel costs by 25% while maximizing tiller strength."}</li>
              </>
            )}
            {selectedCrop.includes('Potato') && (
              <>
                <li>{lang === 'BN' ? "কার্ডিনাল আলুর জন্য নিয়মিত ছত্রাকনাশক স্প্রে করলে লেট ব্লাইট রোগ প্রতিরোধ করা সম্ভব।" : "Early preventative Mancozeb application at 45-day node cycle protects tubers from late blight in high humidity windows."}</li>
                <li>{lang === 'BN' ? "ডিএই কোল্ড স্টোরেজ সমবায়ের সাথে যুক্ত হয়ে ফসল তোলার ১৫ দিন পর বিক্রি করলে ২০% বেশি লাভ হয়।" : "Pooling harvest with DAE Cold Storage Cooperatives allows selling 15-30 days post-harvest for up to +20% higher market price."}</li>
              </>
            )}
            {selectedCrop.includes('Mustard') && (
              <>
                <li>{lang === 'BN' ? "বারি-১৪ সরিষা অত্যন্ত লাভজনক স্বল্পমেয়াদী ফসল যা পরবর্তী ধান চাষের জন্য জমিকে উর্বর করে।" : "BARI-14 Mustard completes its cycle in 75 days, fitting perfectly between Aman and Boro rice for 3-crop annual rotation."}</li>
              </>
            )}
            {selectedCrop.includes('Aman') && (
              <>
                <li>{lang === 'BN' ? "আমন ধানের ক্ষেত্রে বন্যা সহনশীল সুবর্ণলতা ও বিআরআরআই-৭৫ জাত ব্যবহারের পরামর্শ দেয়া হলো।" : "BRRI-75 short-duration Aman Paddy mitigates early flood vulnerability in low-lying Gazipur and Bogura basins."}</li>
              </>
            )}
          </ul>
        </div>

      </div>

      {/* SEASONAL AGRONOMIC MILESTONES TIMELINE */}
      <div className="space-y-3">
        <h4 className="text-sm font-extrabold text-[#1A2A1A] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2D4F1E]" />
          <span>{lang === 'BN' ? "ফসল চক্র ও বিক্রির সময়সীমা ক্যালেন্ডার:" : "Seasonal Agronomic Cycle & Peak Price Selling Window:"}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-1">
            <span className="text-[10px] font-black text-[#2D4F1E] uppercase">Stage 1: Sowing</span>
            <div className="font-extrabold text-gray-800">{lang === 'BN' ? "বীজ তলা ও চারা রোপণ" : "Land Prep & Transplant"}</div>
            <div className="text-gray-500 font-medium text-[11px]">Dec 15 - Jan 10</div>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-1">
            <span className="text-[10px] font-black text-sky-700 uppercase">Stage 2: Care</span>
            <div className="font-extrabold text-gray-800">{lang === 'BN' ? "সেচ, সার ও বালাইনাশক" : "NPK Boost & AWD Water"}</div>
            <div className="text-gray-500 font-medium text-[11px]">Jan 15 - Mar 30</div>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-1">
            <span className="text-[10px] font-black text-amber-600 uppercase">Stage 3: Harvest</span>
            <div className="font-extrabold text-gray-800">{lang === 'BN' ? "ফসল কর্তন ও গ্রেডিং" : "Harvest & DAE Certification"}</div>
            <div className="text-gray-500 font-medium text-[11px]">Apr 15 - May 10</div>
          </div>

          <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 space-y-1">
            <span className="text-[10px] font-black text-emerald-800 uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Stage 4: Peak Sale
            </span>
            <div className="font-extrabold text-emerald-900">{lang === 'BN' ? "সর্বোচ্চ বাজার মূল্য উইন্ডো" : "Direct Escrow Auction"}</div>
            <div className="text-emerald-700 font-medium text-[11px]">May 15 - Jun 20</div>
          </div>

        </div>
      </div>

    </div>
  );
};
