import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { supabase, EventType } from '../lib/supabase';

export default function PublicProfile() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventTypes();
  }, []);

  const loadEventTypes = async () => {
    const { data } = await supabase
      .from('event_types')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setEventTypes(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#a1a1a1] font-inter">
      <div className="max-w-3xl mx-auto pt-20 px-6">
        <div className="bg-[#101010] border border-[#1e1e1e] rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex flex-col items-start relative z-10 w-full">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-xl shadow-blue-600/20">
              A
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">anushka pal</h1>
            <p className="text-sm font-medium text-gray-500 mb-10 tracking-tight">/anushka-pal-fdqm5d</p>
            
            <div className="w-full space-y-3 border-t border-[#1e1e1e]/50 pt-10">
              {eventTypes.length === 0 ? (
                <div className="flex flex-col items-center text-center py-12">
                  <h2 className="text-lg font-bold text-white mb-1">No event types setup</h2>
                  <p className="text-sm font-medium text-gray-500 max-w-sm leading-relaxed">
                    This user has not setup any event types for you to book yet.
                  </p>
                </div>
              ) : (
                eventTypes.map((et) => (
                  <Link
                    key={et.id}
                    to={`/${et.slug}`}
                    className="w-full flex items-center justify-between p-5 bg-black border border-[#1e1e1e] rounded-2xl hover:border-gray-600 transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-1 h-10 rounded-full" style={{ backgroundColor: et.color }} />
                      <div>
                        <h3 className="text-[15px] font-bold text-white group-hover:underline">{et.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-[12px] font-bold text-gray-500">{et.duration}m</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center pb-20">
          <p className="text-[10px] font-black text-gray-700 tracking-[0.2em] uppercase">
            Powered by <span className="text-gray-500">Cal.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
