import { useState } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Calendar, 
  Video, 
  Palette, 
  Clock, 
  Bell, 
  Zap, 
  Lock, 
  UserPlus, 
  ShieldCheck, 
  CreditCard, 
  Code, 
  Globe, 
  Key, 
  Users,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('Profile');

  const sections = [
    { title: 'anushka pal', items: [
      { id: 'Profile', icon: User },
      { id: 'General', icon: SettingsIcon },
      { id: 'Calendars', icon: Calendar },
      { id: 'Conferencing', icon: Video },
      { id: 'Appearance', icon: Palette },
      { id: 'Out of office', icon: Clock },
      { id: 'Push notifications', icon: Bell },
      { id: 'Features', icon: Zap },
    ]},
    { title: 'Security', items: [
      { id: 'Password', icon: Lock },
      { id: 'Impersonation', icon: UserPlus },
      { id: 'Compliance', icon: ShieldCheck },
    ]},
    { title: 'Billing', items: [
      { id: 'Manage billing', icon: CreditCard },
    ]},
    { title: 'Developer', items: [
      { id: 'Webhooks', icon: Globe },
      { id: 'OAuth', icon: Code },
      { id: 'API keys', icon: Key },
    ]},
    { title: 'My teams', items: [
      { id: 'Teams', icon: Users },
    ]},
  ];

  return (
    <div className="animate-in fade-in flex min-h-screen bg-black overflow-hidden -mt-10 -mx-8">
      {/* Settings Sub-Sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-[#1e1e1e] flex flex-col p-6 overflow-y-auto">
        <Link to="/" className="flex items-center text-gray-400 hover:text-white mb-8 group transition-all">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back</span>
        </Link>
        
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              {section.title !== 'anushka pal' && (
                <SectionHeader title={section.title} />
              )}
              {section.title === 'anushka pal' && (
                <div className="flex items-center space-x-2 mb-2">
                   <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white">
                    AV
                  </div>
                  <span className="text-[13px] font-bold text-gray-400">anushka pal</span>
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-[14px] font-medium transition-all ${
                      activeSection === item.id 
                        ? 'bg-[#1e1e1e] text-white shadow-sm' 
                        : 'text-gray-400 hover:text-white hover:bg-[#151515]'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.id}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Settings Content */}
      <main className="flex-1 p-12 overflow-y-auto bg-[#101010]/30">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-white mb-1">Profile</h1>
            <p className="text-sm text-gray-500 font-medium">Manage settings for your Cal.com profile</p>
          </div>

          <div className="bg-[#101010] border border-[#1e1e1e] rounded-2xl p-8 space-y-10 shadow-xl">
            {/* Profile Picture */}
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                A
              </div>
              <div className="space-y-3">
                <p className="text-sm font-bold text-white">Profile picture</p>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-[#1e1e1e] border border-[#252525] text-white rounded-lg text-sm font-bold hover:bg-[#252525] transition-all">
                    Upload avatar
                  </button>
                  <button className="text-sm font-bold text-gray-500 hover:text-white transition-all">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white">Username</label>
                <div className="flex items-center">
                  <div className="px-4 py-2 bg-[#1a1a1a] border border-[#252525] border-r-0 rounded-l-lg text-sm font-medium text-gray-500">
                    cal.com/
                  </div>
                  <input 
                    type="text" 
                    defaultValue="anushka-pal-fdqm5d"
                    className="flex-1 bg-black border border-[#252525] rounded-r-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:border-gray-600 outline-none"
                  />
                </div>
                <p className="text-[12px] text-gray-600 flex items-center">
                   <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                   Tip: You can add a '+' between usernames (e.g. cal.com/anna+brian) to meet with multiple people
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white">Full name</label>
                <input 
                  type="text" 
                  defaultValue="anushka pal"
                  className="w-full bg-black border border-[#252525] rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:border-gray-600 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white">Email</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 flex items-center justify-between bg-black border border-[#252525] rounded-lg px-4 py-2">
                    <span className="text-sm font-medium text-white">palanushka232@gmail.com</span>
                    <div className="flex items-center space-x-3">
                      <span className="px-1.5 py-0.5 bg-blue-900/30 text-blue-400 border border-blue-900/50 rounded text-[10px] font-bold uppercase tracking-wider">Primary</span>
                      <button className="text-gray-600 hover:text-white">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </button>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-[#1e1e1e] text-white rounded-lg text-sm font-bold hover:bg-[#1e1e1e] transition-all flex items-center">
                    <span className="mr-2">+</span> Add email
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white">About</label>
                <div className="bg-black border border-[#252525] rounded-lg overflow-hidden">
                  <div className="flex items-center space-x-4 px-4 py-2 border-b border-[#252525] bg-[#1a1a1a]/50">
                    <button className="text-[12px] font-bold text-white flex items-center">Normal <ChevronRight className="w-3 h-3 ml-1 rotate-90" /></button>
                    <div className="h-4 w-px bg-gray-800" />
                    <button className="text-gray-500 hover:text-white font-bold italic">B</button>
                    <button className="text-gray-500 hover:text-white italic">I</button>
                    <button className="text-gray-500 hover:text-white font-mono font-bold">⠶</button>
                  </div>
                  <textarea 
                    className="w-full bg-transparent p-4 text-sm font-medium text-white focus:outline-none outline-none min-h-[160px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1e1e1e]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">Connected accounts</h3>
              </div>
              <div className="flex items-center justify-between p-4 bg-black border border-[#252525] rounded-xl group transition-all">
                <div className="flex items-center space-x-3">
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                  <span className="text-sm font-medium text-white">Google</span>
                </div>
                <button className="px-4 py-1.5 bg-[#1e1e1e] text-white border border-[#252525] rounded-lg text-xs font-bold hover:bg-[#252525] transition-all">
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2 mt-4 flex items-center">
      <div className="w-4 h-px bg-gray-800 mr-2" />
      {title}
    </h3>
  );
}
