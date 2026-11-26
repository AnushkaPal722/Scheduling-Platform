import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Copy, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Search, 
  MoreHorizontal, 
  Link as LinkIcon,
  Copy as DuplicateIcon,
  Code as EmbedIcon
} from 'lucide-react';
import { supabase, EventType } from '../lib/supabase';

export default function Dashboard() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEventTypes();
  }, []);

  const loadEventTypes = async () => {
    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEventTypes(data);
    }
    setLoading(false);
  };

  const deleteEventType = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event type?')) return;
    const { error } = await supabase.from('event_types').delete().eq('id', id);
    if (!error) loadEventTypes();
  };

  const duplicateEventType = async (eventType: EventType) => {
    const { data, error } = await supabase
      .from('event_types')
      .insert([{
        title: `${eventType.title} (copy)`,
        description: eventType.description,
        duration: eventType.duration,
        slug: `${eventType.slug}-copy-${Math.floor(Math.random() * 1000)}`,
        color: eventType.color
      }]);
    if (!error) loadEventTypes();
    setOpenMenuId(null);
  };

  const toggleVisibility = async (eventType: EventType) => {
    // In a real app we'd have a 'hidden' column, for now we can toggle the slug or just show the UI state
    alert("Visibility toggle feature would go here. In this demo it toggles the UI state.");
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const filteredEventTypes = eventTypes.filter(et => 
    et.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    et.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Event types</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium font-inter">
            Configure different events for people to book on your calendar.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1e1e1e] border border-transparent focus:border-gray-700 text-white text-sm rounded-lg pl-10 pr-4 py-2 w-64 outline-none transition-all"
            />
          </div>
          <Link
            to="/event-types/new"
            className="flex items-center px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-100 transition-all active:scale-95 shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New
          </Link>
        </div>
      </div>

      {filteredEventTypes.length === 0 ? (
        <div className="text-center py-24 bg-[#101010] rounded-2xl border border-[#1e1e1e] border-dashed">
          <Calendar className="mx-auto h-12 w-12 text-gray-700 mb-4" />
          <h3 className="text-lg font-bold text-white">No event types</h3>
          <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto">
            {searchQuery ? `No results for "${searchQuery}"` : "Create your first event type to start scheduling."}
          </p>
          <div className="mt-8">
            <Link
              to="/event-types/new"
              className="inline-flex items-center px-6 py-3 bg-[#1e1e1e] text-white rounded-xl text-sm font-bold hover:bg-[#252525] transition-all active:scale-95 border border-[#252525]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event Type
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-[#101010] border border-[#1e1e1e] rounded-xl divide-y divide-[#1e1e1e]">
          {filteredEventTypes.map((eventType, idx) => (
            <div
              key={eventType.id}
              className="group flex flex-col md:flex-row md:items-center justify-between px-6 py-4 hover:bg-[#151515] transition-all duration-200"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center space-x-4 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 leading-none">
                    <h3 className="text-[17px] font-bold text-white truncate group-hover:underline cursor-pointer tracking-tight">
                      {eventType.title}
                    </h3>
                    <span className="text-[15px] font-medium text-gray-500 tracking-tight">/{eventType.slug}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center px-2 py-0.5 bg-[#1e1e1e] border border-[#252525] rounded text-[13px] font-bold text-gray-400">
                      <Clock className="h-3 w-3 mr-1.5" />
                      {eventType.duration}m
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-4 mt-4 md:mt-0 relative">
                <div className="flex items-center space-x-2">
                   <span className="text-[14px] font-medium text-gray-500 mr-1">Hidden</span>
                   <button
                    onClick={() => toggleVisibility(eventType)}
                    className={`w-10 h-5 rounded-full transition-all duration-300 flex items-center px-0.5 ${
                      eventType.slug === 'secret' ? 'bg-[#1e1e1e]' : 'bg-gray-400'
                    }`}
                   >
                     <div className={`h-4 w-4 rounded-full transition-all duration-300 ${
                       eventType.slug === 'secret' ? 'bg-gray-600 translate-x-0' : 'bg-white translate-x-5'
                     }`} />
                   </button>
                </div>

                <div className="flex items-center space-x-1">
                  <Link
                    to={`/${eventType.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#1e1e1e] rounded-lg transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => copyLink(eventType.slug)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#1e1e1e] rounded-lg transition-all"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === eventType.id ? null : eventType.id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-[#1e1e1e] rounded-lg transition-all"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenuId === eventType.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-[#101010] border border-[#1e1e1e] rounded-xl shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in slide-up">
                        <Link to={`/event-types/${eventType.id}/edit`}>
                          <MenuItem icon={Edit} label="Edit" />
                        </Link>
                        <MenuItem icon={DuplicateIcon} label="Duplicate" onClick={() => duplicateEventType(eventType)} />
                        <MenuItem icon={EmbedIcon} label="Embed" onClick={() => alert("Embed code copied!")} />
                        <div className="h-px bg-[#1e1e1e] my-1" />
                        <MenuItem icon={Trash2} label="Delete" color="text-red-500" onClick={() => deleteEventType(eventType.id)} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, color = "text-gray-400", onClick }: { icon: any, label: string, color?: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center px-4 py-2 text-[14px] font-bold ${color} hover:bg-[#1e1e1e] hover:text-white transition-all text-left underline-none`}
    >
      <Icon className="w-4 h-4 mr-3" />
      {label}
    </button>
  );
}
