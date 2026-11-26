import { ArrowRight } from 'lucide-react';

interface FeatureGateProps {
  badge: string;
  headline: string;
  description: string;
  benefits?: string[];
}

export default function FeatureGate({ badge, headline, description, benefits }: FeatureGateProps) {
  return (
    <div className="animate-in fade-in flex items-center justify-center py-20">
      <div className="bg-[#101010] border border-[#1e1e1e] rounded-3xl overflow-hidden max-w-[850px] w-full flex flex-col md:flex-row shadow-2xl">
        <div className="flex-1 p-10 md:p-12">
          <span className="inline-block px-2 py-1 bg-[#1e1e1e] text-gray-400 rounded text-[10px] font-bold uppercase tracking-wider mb-6">
            {badge}
          </span>
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            {headline}
          </h1>
          <p className="text-gray-400 text-base mb-8 leading-relaxed">
            {description}
          </p>
          
          {benefits && (
            <ul className="space-y-3 mb-10">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start text-gray-400 text-sm">
                  <span className="mr-3 mt-1.5 w-1 h-1 bg-gray-500 rounded-full flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center space-x-2 mb-10">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Available on</span>
            <div className="flex space-x-1">
              <span className="px-2 py-0.5 bg-orange-900/30 text-orange-400 border border-orange-900/50 rounded text-[10px] font-bold">Teams</span>
              <span className="px-2 py-0.5 bg-purple-900/30 text-purple-400 border border-purple-900/50 rounded text-[10px] font-bold">Orgs</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="flex items-center px-6 py-2.5 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-100 transition-all active:scale-95">
              Try it for free
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button className="text-sm font-bold text-gray-400 hover:text-white transition-all">
              Learn more
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-[#1a1a1a] relative hidden md:block">
          {/* Mockup graphic decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/4 bg-[#222] rounded-xl border border-[#333] shadow-inner shadow-black/50 overflow-hidden">
            <div className="p-4 border-b border-[#333] bg-[#252525]">
              <div className="w-1/3 h-2 bg-[#333] rounded-full" />
            </div>
            <div className="p-6 space-y-4">
              <div className="w-full h-32 bg-gradient-to-t from-[#111] to-[#222] rounded-lg border border-[#333]" />
              <div className="space-y-2">
                <div className="w-2/3 h-2 bg-[#333] rounded-full" />
                <div className="w-1/2 h-2 bg-[#333] rounded-full opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
