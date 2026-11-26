import { Zap, Plus, MessageSquare, Mail, Phone } from 'lucide-react';

export default function Workflows() {
  const calTemplates = [
    { title: 'Call to confirm booking', sub: '2 hrs before event starts', icon: Phone },
    { title: 'Follow up with no shows', sub: '30m after event ends', icon: Phone },
    { title: 'Remind attendees to bring ID', sub: '1 day before event starts', icon: Phone },
  ];

  const standardTemplates = [
    { title: 'Send SMS reminder', sub: '24 hours before event starts', icon: MessageSquare },
    { title: 'Follow up with no shows', sub: '30m after event ends', icon: MessageSquare },
    { title: 'Remind attendees to bring ID', sub: '1 day before event starts', icon: Mail },
    { title: 'Email reminder', sub: '1 hour before event starts', icon: Mail },
    { title: 'Custom email reminder', sub: 'Event is rescheduled to host', icon: Mail },
    { title: 'Custom SMS reminder', sub: 'When event is scheduled', icon: MessageSquare },
  ];

  return (
    <div className="animate-in fade-in max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-12">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workflows</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Create workflows to automate notifications and reminders
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-100 transition-all active:scale-95">
          <Plus className="h-4 w-4 mr-2" />
          New
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-16 mb-12">
        <div className="w-16 h-16 bg-[#1e1e1e] rounded-full flex items-center justify-center mb-6">
          <Zap className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Workflows</h3>
        <p className="text-sm font-medium text-gray-500 max-w-sm text-center mb-8 leading-relaxed">
          Workflows enable simple automation to send notifications & reminders enabling you to build processes around your events.
        </p>
        <button className="flex items-center px-4 py-2 border border-[#1e1e1e] text-white rounded-lg text-sm font-bold hover:bg-[#1e1e1e] transition-all">
          <Plus className="h-4 w-4 mr-2" />
          Create a workflow
        </button>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="text-sm font-bold text-white mb-4">Cal.ai templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {calTemplates.map((t, idx) => (
              <button key={idx} className="flex items-center space-x-4 p-4 bg-[#101010] border border-[#1e1e1e] rounded-xl hover:border-gray-700 hover:bg-[#151515] transition-all text-left">
                <div className="bg-[#1e1e1e] p-2 rounded-lg">
                  <t.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-white">{t.title}</p>
                  <p className="text-[12px] font-medium text-gray-500">{t.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-4">Standard templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {standardTemplates.map((t, idx) => (
              <button key={idx} className="flex items-center space-x-4 p-4 bg-[#101010] border border-[#1e1e1e] rounded-xl hover:border-gray-700 hover:bg-[#151515] transition-all text-left">
                <div className="bg-[#1e1e1e] p-2 rounded-lg">
                  <t.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-white">{t.title}</p>
                  <p className="text-[12px] font-medium text-gray-500">{t.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
