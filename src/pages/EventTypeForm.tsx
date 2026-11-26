import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Globe, Layout, ChevronDown, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function EventTypeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    slug: '',
    color: '#3b82f6',
    buffer_time: 0,
    custom_questions: [] as { label: string; required: boolean; type: string }[],
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (isEdit) {
      loadEventType();
    }
  }, [id]);

  const loadEventType = async () => {
    const { data } = await supabase
      .from('event_types')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) {
      setFormData({
        title: data.title,
        description: data.description,
        duration: data.duration,
        slug: data.slug,
        color: data.color,
        buffer_time: data.buffer_time || 0,
        custom_questions: data.custom_questions || [],
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        const { error } = await supabase
          .from('event_types')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('event_types')
          .insert([formData]);

        if (error) throw error;
      }

      navigate('/');
    } catch (error) {
      console.error('Error saving event type:', error);
      alert('Failed to save event type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 border border-[#1e1e1e] rounded-lg text-gray-400 hover:text-white hover:bg-[#1e1e1e] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex flex-col">
             <h1 className="text-xl font-bold text-white tracking-tight">
              {isEdit ? 'Edit Event Type' : 'Create New Event Type'}
            </h1>
            <p className="text-[13px] text-gray-500 font-medium">/{formData.slug || 'slug'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
           <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sub-sidebar View */}
        <div className="lg:col-span-1 space-y-1">
          {[
            { id: 'general', label: 'General', icon: Layout },
            { id: 'availability', label: 'Availability', icon: Clock },
            { id: 'advanced', label: 'Advanced', icon: Globe },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-[14px] font-bold transition-all ${
                activeTab === item.id ? 'bg-[#1e1e1e] text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#101010] border border-[#1e1e1e] rounded-2xl p-8 space-y-8">
            
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <label className="block text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-black border border-[#252525] focus:border-white text-white rounded-xl px-4 py-3 outline-none transition-all font-medium"
                  placeholder="e.g. 15min Quick Sync"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Slug
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-[#252525] bg-[#1e1e1e] text-gray-500 text-sm font-medium">
                      cal.com/
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      className="flex-1 bg-black border border-[#252525] focus:border-white text-white rounded-r-xl px-4 py-3 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Duration
                  </label>
                  <div className="relative">
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData((prev) => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full bg-black border border-[#252525] focus:border-white text-white rounded-xl px-4 py-3 outline-none transition-all font-medium appearance-none"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-black border border-[#252525] focus:border-white text-white rounded-xl px-4 py-3 outline-none transition-all font-medium resize-none"
                  placeholder="Tell your bookers what this meeting is about..."
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Theme Color
                </label>
                <div className="flex items-center space-x-3">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#000000'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, color }))}
                      className={`h-8 w-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        formData.color === color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {formData.color === color && <Check className={`w-4 h-4 ${color === '#000000' ? 'text-white' : 'text-white'}`} />}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center space-x-2 text-[14px] font-medium text-gray-500">
                    <span>Preview</span>
                    <div className="w-12 h-6 rounded px-2 py-0.5 text-[10px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: formData.color }}>
                      {formData.duration}m
                    </div>
                  </div>
                </div>
              </div>
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="text-center py-12 bg-black border border-[#252525] border-dashed rounded-xl flex flex-col items-center">
                  <Clock className="w-12 h-12 text-[#3b82f6] mb-4 opacity-80" />
                  <h3 className="text-lg font-bold text-white mb-2">Default Schedule Applies</h3>
                  <p className="text-[14px] text-gray-400 font-medium max-w-md text-center mb-8 leading-relaxed">
                    This event type automatically uses your default weekly availability. You can configure your working hours globally from the Availability settings page.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/availability')}
                    className="px-6 py-3 bg-[#1e1e1e] text-white rounded-xl text-sm font-bold hover:bg-[#252525] transition-all border border-[#252525] shadow-sm"
                  >
                    Configure Availability
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <label className="block text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Buffer Time
                  </label>
                  <p className="text-[13px] text-gray-500 font-medium mb-3">Add time before and after the event to prepare or wrap up.</p>
                  <div className="relative w-full md:w-1/2">
                    <select
                      value={formData.buffer_time}
                      onChange={(e) => setFormData((prev) => ({ ...prev, buffer_time: parseInt(e.target.value) }))}
                      className="w-full bg-black border border-[#252525] focus:border-white text-white rounded-xl px-4 py-3 outline-none transition-all font-medium appearance-none"
                    >
                      <option value={0}>No buffer</option>
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div className="border-t border-[#1e1e1e] pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Custom Questions
                      </label>
                      <p className="text-[13px] text-gray-500 font-medium">Ask invitees extra questions when they book.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        custom_questions: [...prev.custom_questions, { label: 'New Question', required: false, type: 'text' }] 
                      }))}
                      className="px-3 py-1.5 bg-[#1e1e1e] hover:bg-[#252525] text-white rounded-lg text-sm font-bold transition-all"
                    >
                      + Add Question
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.custom_questions.map((q, i) => (
                      <div key={i} className="flex flex-col md:flex-row gap-4 p-4 bg-black border border-[#252525] rounded-xl relative group">
                         <div className="flex-1">
                           <input 
                             type="text" value={q.label}
                             onChange={(e) => {
                               const newQ = [...formData.custom_questions];
                               newQ[i].label = e.target.value;
                               setFormData(prev => ({ ...prev, custom_questions: newQ }));
                             }}
                             className="w-full bg-transparent border-b border-[#252525] focus:border-white text-white px-0 py-2 outline-none transition-all font-medium text-sm"
                             placeholder="Question text"
                           />
                         </div>
                         <div className="flex items-center space-x-4">
                           <label className="flex items-center space-x-2 cursor-pointer">
                             <input 
                               type="checkbox" checked={q.required}
                               onChange={(e) => {
                                 const newQ = [...formData.custom_questions];
                                 newQ[i].required = e.target.checked;
                                 setFormData(prev => ({ ...prev, custom_questions: newQ }));
                               }}
                               className="accent-white cursor-pointer"
                             />
                             <span className="text-sm text-gray-400 font-medium">Required</span>
                           </label>
                           <button 
                             type="button"
                             onClick={() => {
                               const newQ = [...formData.custom_questions];
                               newQ.splice(i, 1);
                               setFormData(prev => ({ ...prev, custom_questions: newQ }));
                             }}
                             className="text-gray-500 hover:text-red-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all px-2"
                           >
                             Remove
                           </button>
                         </div>
                      </div>
                    ))}
                    {formData.custom_questions.length === 0 && (
                      <div className="text-center py-8 bg-black border border-dashed border-[#252525] rounded-xl text-gray-500 text-sm font-medium">
                        No custom questions added yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
