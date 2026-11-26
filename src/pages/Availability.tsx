import { useEffect, useState } from 'react';
import { Plus, Globe, MoreHorizontal, Save, Clock } from 'lucide-react';
import { supabase, Availability as AvailabilityType } from '../lib/supabase';

const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const TIMEZONES = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney'
];

export default function Availability() {
  const [availability, setAvailability] = useState<AvailabilityType[]>([]);
  const [timezone, setTimezone] = useState('UTC');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<AvailabilityType[]>([]);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    const { data } = await supabase
      .from('availability')
      .select('*')
      .order('day_of_week', { ascending: true });

    if (data && data.length > 0) {
      setAvailability(data);
      setEditingData(data);
      setTimezone(data[0].timezone);
    }
    setLoading(false);
  };

  const handleToggleDay = (dayValue: number) => {
    const exists = editingData.find(d => d.day_of_week === dayValue);
    if (exists) {
      setEditingData(editingData.filter(d => d.day_of_week !== dayValue));
    } else {
      setEditingData([...editingData, {
        day_of_week: dayValue,
        start_time: '09:00:00',
        end_time: '17:00:00',
        timezone: timezone
      } as any]);
    }
  };

  const handleTimeChange = (dayValue: number, field: 'start_time' | 'end_time', value: string) => {
    setEditingData(editingData.map(d => 
      d.day_of_week === dayValue ? { ...d, [field]: value } : d
    ));
  };

  const handleSave = async () => {
    setLoading(true);
    const { error: deleteError } = await supabase
      .from('availability')
      .delete()
      .neq('timezone', 'placeholder_hack');

    if (!deleteError) {
      const { error: insertError } = await supabase
        .from('availability')
        .insert(editingData.map(d => ({
          day_of_week: d.day_of_week,
          start_time: d.start_time,
          end_time: d.end_time,
          timezone: timezone
        })));

      if (!insertError) {
        setAvailability(editingData);
        setIsEditing(false);
      } else {
        alert("Error saving availability");
      }
    }
    setLoading(false);
  };

  const dayLabels = (avail: AvailabilityType[]) => {
    if (avail.length === 0) return 'No days selected';
    const sorted = [...avail].sort((a, b) => a.day_of_week - b.day_of_week);
    return sorted.map(a => DAYS.find(d => d.value === a.day_of_week)?.label).join(', ');
  };

  if (loading && !isEditing) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Availability</h1>
          <p className="mt-2 text-[16px] text-gray-500 font-medium font-inter leading-relaxed">
            Configure times when you are available for bookings.
          </p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center px-6 py-3 bg-white text-black rounded-xl text-[15px] font-bold hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
          >
            <Plus className="h-5 w-5 mr-3" />
            New schedule
          </button>
        )}
      </div>

      <div className="bg-[#101010] border border-[#1e1e1e] rounded-[24px] overflow-hidden p-10 hover:bg-[#131313] transition-all duration-200 group relative">
        {isEditing ? (
          <div className="space-y-10 animate-in slide-up">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Edit Default Schedule</h3>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 text-gray-400 font-bold text-[15px] hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center px-6 py-3 bg-white text-black rounded-xl text-[15px] font-bold hover:bg-gray-100 transition-all shadow-xl"
                >
                  <Save className="w-5 h-5 mr-3" />
                  Save Changes
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {DAYS.map(day => {
                const dayAvail = editingData.find(d => d.day_of_week === day.value);
                return (
                  <div key={day.value} className="flex items-center justify-between py-5 border-b border-[#1e1e1e]">
                    <div className="flex items-center space-x-6">
                      <div 
                        onClick={() => handleToggleDay(day.value)}
                        className={`w-12 h-6 rounded-full cursor-pointer transition-all flex items-center px-1.5 ${
                          dayAvail ? 'bg-white' : 'bg-gray-700'
                        }`}
                      >
                         <div className={`h-4 w-4 rounded-full transition-all ${
                           dayAvail ? 'bg-black translate-x-5' : 'bg-gray-400 translate-x-0'
                         }`} />
                      </div>
                      <span className={`text-[18px] font-bold ${dayAvail ? 'text-white' : 'text-gray-500 w-24'}`}>{day.label}</span>
                    </div>

                    {dayAvail ? (
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                           <input 
                             type="time" 
                             value={dayAvail.start_time.substring(0, 5)}
                             onChange={(e) => handleTimeChange(day.value, 'start_time', e.target.value + ':00')}
                             className="bg-black border border-[#252525] text-white rounded-xl px-4 py-2 text-[16px] outline-none focus:border-white transition-all font-bold shadow-inner"
                           />
                           <span className="text-gray-500 font-bold text-lg">—</span>
                           <input 
                             type="time" 
                             value={dayAvail.end_time.substring(0, 5)}
                             onChange={(e) => handleTimeChange(day.value, 'end_time', e.target.value + ':00')}
                             className="bg-black border border-[#252525] text-white rounded-xl px-4 py-2 text-[16px] outline-none focus:border-white transition-all font-bold shadow-inner"
                           />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[14px] font-bold text-gray-700 uppercase tracking-[0.1em]">Unavailable</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-start justify-between">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#1e1e1e] rounded-xl text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-white">Working hours</h3>
                  <div className="flex items-center space-x-3 mt-1.5">
                    <span className="px-2.5 py-1 bg-[#1e1e1e] text-gray-400 rounded-md text-[12px] font-bold uppercase tracking-widest">
                      Default schedule
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-5 border-l-2 border-[#1e1e1e] pl-8 ml-6">
                <p className="text-[17px] font-medium text-gray-400 leading-relaxed max-w-xl">
                  {dayLabels(availability)}
                </p>
                <div className="flex items-center text-[16px] text-gray-500 space-x-2.5 font-bold">
                  <Globe className="w-5 h-5" />
                  {isEditing ? (
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="bg-[#1e1e1e] border border-[#252525] text-white rounded-lg px-3 py-1 outline-none font-medium text-[14px]"
                    >
                      {TIMEZONES.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  ) : (
                    <span>{timezone}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-8 md:mt-0 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
              <button 
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-[#1e1e1e] border border-[#252525] text-white rounded-xl text-sm font-bold hover:bg-[#252525] transition-all shadow-sm"
              >
                Edit
              </button>
              <button className="p-2.5 text-gray-400 hover:text-white hover:bg-[#1e1e1e] rounded-xl transition-all">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 flex items-center justify-center text-[15px] text-gray-600 font-medium">
        Looking for shift based scheduling? <button className="text-gray-400 ml-1.5 hover:underline font-bold transition-colors">Try Cal.ai</button>
      </div>
    </div>
  );
}
