import React from 'react';
import { LanguageMode } from '../types';
import { getTranslation } from '../utils/translations';
import { Sprout, ShieldCheck, Microscope, Truck, Award, Users, CheckCircle, ArrowRight, HeartHandshake, Globe } from 'lucide-react';

interface AboutUsSectionProps {
  lang: LanguageMode;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({ lang }) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  return (
    <div className="space-y-10 font-sans">
      
      {/* HERO BANNER */}
      <div className="bg-gradient-to-br from-[#1A3816] via-[#2D4F1E] to-[#122410] rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-300 border border-white/10">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'BN' ? "জাতীয় কৃষি বিপ্লব ও ডিজিটাল সমবায়" : "National Agri-Tech Federation of Bangladesh"}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {t('aboutTitle')}
          </h2>
          <p className="text-sm md:text-base text-gray-200 leading-relaxed font-medium">
            {t('aboutSubtitle')}
          </p>
        </div>
      </div>

      {/* MISSION & VISION CARD */}
      <div className="bg-white rounded-3xl p-8 border border-[#1A2A1A]/10 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#2D4F1E]/10 rounded-2xl text-[#2D4F1E]">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-[#1A2A1A]">{t('missionHeader')}</h3>
        </div>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed font-sans">
          {t('missionBody')}
        </p>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { number: t('stat1'), label: t('stat1Label'), icon: Users, color: "text-[#2D4F1E]" },
          { number: t('stat2'), label: t('stat2Label'), icon: ShieldCheck, color: "text-amber-600" },
          { number: t('stat3'), label: t('stat3Label'), icon: Microscope, color: "text-sky-600" },
          { number: t('stat4'), label: t('stat4Label'), icon: Truck, color: "text-emerald-600" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-[#1A2A1A]/10 shadow-sm text-center space-y-2">
            <stat.icon className={`w-8 h-8 mx-auto ${stat.color}`} />
            <h4 className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.number}</h4>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* CORE ECOSYSTEM PILLARS */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-[#1A2A1A] text-center">
          {lang === 'BN' ? "স্মার্টফার্মার ৪টি প্রধান স্তম্ভ" : "The 4 Pillars of SmartFarmer OS"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-[#1A2A1A]/10 shadow-sm space-y-3">
            <div className="p-3 bg-sky-50 rounded-2xl text-sky-700 w-fit">
              <Microscope className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-[#1A2A1A]">{t('pillar1Title')}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{t('pillar1Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#1A2A1A]/10 shadow-sm space-y-3">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-700 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-[#1A2A1A]">{t('pillar2Title')}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{t('pillar2Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#1A2A1A]/10 shadow-sm space-y-3">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700 w-fit">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-[#1A2A1A]">{t('pillar3Title')}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{t('pillar3Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#1A2A1A]/10 shadow-sm space-y-3">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-700 w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-[#1A2A1A]">{t('pillar4Title')}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{t('pillar4Desc')}</p>
          </div>

        </div>
      </div>

      {/* TRANSPARENT TRUST CHARTER FOOTER */}
      <div className="bg-[#1A2A1A] text-white p-8 rounded-3xl space-y-4 text-center">
        <Globe className="w-10 h-10 mx-auto text-emerald-400" />
        <h3 className="text-xl font-extrabold text-white">
          {lang === 'BN' ? "ডিজিটাল বাংলাদেশ কৃষি নেটওয়ার্ক" : "Digital Agricultural Co-Operative Network"}
        </h3>
        <p className="text-xs text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {lang === 'BN' 
            ? "কৃষি সম্প্রসারণ অধিদপ্তর (DAE), বাংলাদেশ কৃষি গবেষণা কাউন্সিল (BARC) এবং স্থানীয় কৃষক সমবায়ের সাথে যৌথ উদ্যোগে পরিচালিত।"
            : "Operated in federated cooperation with DAE, BARC, and regional smallholder cooperatives across Gazipur, Bogura, Moulvibazar, and Rajshahi."}
        </p>
      </div>

    </div>
  );
};
