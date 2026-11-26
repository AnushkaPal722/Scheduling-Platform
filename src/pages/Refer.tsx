import { Copy, Gift, Info, DollarSign, TrendingUp } from 'lucide-react';

export default function Refer() {
  const quickstartItems = [
    { title: 'Share on LinkedIn', icon: 'in' },
    { title: 'Share on X', icon: 'X' },
    { title: 'Share via Email', icon: '✉' },
    { title: 'Share on Threads', icon: '𝝿' },
    { title: 'Refer via Team', icon: '田' },
    { title: 'Marketing assets', icon: '▦' },
  ];

  return (
    <div className="animate-in fade-in max-w-6xl mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Referral Link Card */}
          <div className="bg-[#101010] border border-[#1e1e1e] rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <h2 className="text-[14px] font-bold text-gray-400 mb-4 uppercase tracking-widest">Referral link</h2>
              <div className="flex items-center space-x-3 mb-10">
                <div className="flex-1 bg-black border border-[#252525] rounded-xl px-4 py-3 flex items-center justify-between group-hover:border-gray-700 transition-all">
                  <span className="text-[15px] font-medium text-gray-400 truncate">refer.cal.com/anushka-pal-fdqm5d-bj3p</span>
                  <div className="w-px h-6 bg-[#1e1e1e] mx-2" />
                  <button className="flex items-center text-white text-[13px] font-bold hover:opacity-70 transition-all">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy link
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[14px] font-bold text-gray-400 uppercase tracking-widest">Rewards</h2>
                <button className="flex items-center text-[12px] font-bold text-gray-500 hover:text-white transition-all">
                  View terms <Info className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </div>

              <div className="bg-black border border-[#252525] rounded-xl p-6 space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#1e1e1e] p-2 rounded-lg">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-white">20% per sale for 1 year</p>
                    <p className="text-[13px] font-medium text-gray-500 mt-0.5 leading-relaxed">
                       Refer a new customer and earn 20% on every payment they make for 12 months.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-[#1e1e1e] p-2 rounded-lg">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-white">New users get 20% off for 12 months</p>
                    <p className="text-[13px] font-medium text-gray-500 mt-0.5 leading-relaxed">
                       Anyone who signs up using your link gets 20% off all plans for their first year.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 flex items-center space-x-4 text-[11px] font-black text-gray-600 uppercase tracking-tight">
                  <span>$10 minimum payout amount</span>
                  <div className="w-1 h-1 bg-gray-800 rounded-full" />
                  <span>30-day holding period</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity State */}
          <div className="bg-[#101010] border border-[#1e1e1e] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#1e1e1e] rounded-full flex items-center justify-center mb-6 relative">
              <TrendingUp className="w-8 h-8 text-gray-500" strokeWidth={1.5} />
              <div className="absolute top-1 right-2 w-2 h-2 bg-gray-500 rounded-full animate-ping" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No activity yet</h3>
            <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto">
              After your first click, your referral statistics will appear here in real-time.
            </p>
          </div>
        </div>

        {/* Sidebar Stats Area */}
        <div className="space-y-6">
          <div className="bg-[#101010] border border-[#1e1e1e] rounded-2xl p-6">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
                 Earnings <Info className="w-3.5 h-3.5 ml-2 text-gray-700" />
               </h3>
               <button className="px-3 py-1 bg-[#1e1e1e] border border-[#252525] text-white rounded-lg text-xs font-bold hover:bg-[#252525] transition-all">
                  Settings
               </button>
             </div>
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-[14px] font-medium text-gray-500">Upcoming</span>
                 <span className="text-[15px] font-bold text-white">$0.00</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-[14px] font-medium text-gray-500">Paid</span>
                 <span className="text-[15px] font-bold text-white">$0.00</span>
               </div>
             </div>
          </div>

          {/* Cal.com Dub Branding Area Placeholder */}
          <div className="bg-gradient-to-br from-[#101010] to-black border border-[#1e1e1e] rounded-2xl p-8 h-[240px] flex flex-col items-center justify-center relative group">
             <div className="w-20 h-20 bg-gray-800 rounded-2xl rotate-12 group-hover:rotate-0 transition-transform flex items-center justify-center shadow-2xl relative z-10">
               <span className="text-white font-black text-xl">Cal.com</span>
             </div>
             <div className="mt-8 text-center relative z-10">
               <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Powered by <span className="text-gray-400">dub</span></p>
             </div>
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Quickstart Tabs */}
      <div className="mt-12 space-y-6">
        <div className="flex items-center space-x-8 border-b border-[#1e1e1e]">
          {['Quickstart', 'Earnings', 'Links', 'Leaderboard', 'FAQ', 'Resources'].map((tab, i) => (
            <button 
              key={tab} 
              className={`pb-4 text-[14px] font-bold transition-all border-b-2 ${
                i === 0 ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickstartItems.map((item, i) => (
            <button key={i} className="bg-[#101010] border border-[#1e1e1e] rounded-xl p-6 flex flex-col items-center justify-center hover:bg-[#151515] hover:border-gray-700 transition-all space-y-4 group">
              <div className="w-10 h-10 bg-[#1e1e1e] rounded-lg flex items-center justify-center text-white font-black text-xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-[12px] font-bold text-gray-400 group-hover:text-white">{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
