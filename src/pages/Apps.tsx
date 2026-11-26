import { Grid, Search } from 'lucide-react';

export default function Apps() {
  const categories = ['All', 'Calendar', 'Conferencing', 'Payment', 'Automation', 'Analytics'];
  
  return (
    <div className="animate-in fade-in max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">App Store</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium font-inter">
            Connect your favorite tools to simplify your scheduling workflow.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search apps"
              className="bg-[#1e1e1e] border border-transparent focus:border-gray-700 text-white text-sm rounded-lg pl-10 pr-4 py-2 w-64 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((c, i) => (
          <button 
            key={i} 
            className={`px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              i === 0 ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-[#1e1e1e]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="bg-[#101010] border border-[#1e1e1e] rounded-2xl p-6 hover:bg-[#151515] transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-[#1e1e1e] rounded-xl flex items-center justify-center">
                <Grid className="w-6 h-6 text-gray-400" />
              </div>
              <button className="px-3 py-1 bg-[#1e1e1e] text-white border border-gray-800 rounded-lg text-xs font-bold hover:bg-gray-700 transition-all">
                Install
              </button>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Integrate App {i}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Sync your events and manage your scheduling directly within this application.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
