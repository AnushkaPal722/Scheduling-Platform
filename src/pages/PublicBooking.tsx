import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Check, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { supabase, EventType, Availability } from '../lib/supabase';

export default function PublicBooking() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rescheduleId = searchParams.get('reschedule');

  const [eventType, setEventType] = useState<EventType | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    customAnswers: {} as Record<string, string>,
  });
  const [step, setStep] = useState<'date' | 'time' | 'form' | 'confirmed'>('date');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (rescheduleId) {
      loadOldBooking();
    }
  }, [rescheduleId]);

  const loadOldBooking = async () => {
    const { data } = await supabase.from('bookings').select('*').eq('id', rescheduleId).maybeSingle();
    if (data) {
      setBookingForm({ name: data.booker_name, email: data.booker_email });
    }
  };

  useEffect(() => {
    loadEventType();
    loadAvailability();
  }, [slug]);

  useEffect(() => {
    if (selectedDate && eventType) {
      loadAvailableSlots();
    }
  }, [selectedDate, eventType]);

  const loadEventType = async () => {
    const { data } = await supabase
      .from('event_types')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      setEventType(data);
    }
    setLoading(false);
  };

  const loadAvailability = async () => {
    const { data } = await supabase.from('availability').select('*');
    if (data) setAvailability(data);
  };

  const loadAvailableSlots = async () => {
    if (!selectedDate || !eventType) return;

    const dayOfWeek = selectedDate.getDay();
    const dayAvailability = availability.filter(a => a.day_of_week === dayOfWeek);

    if (dayAvailability.length === 0) {
      setAvailableSlots([]);
      return;
    }

    const dateStr = selectedDate.toISOString().split('T')[0];
    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('start_time, end_time')
      .eq('event_type_id', eventType.id)
      .eq('booking_date', dateStr)
      .eq('status', 'confirmed');

    const slots: string[] = [];
    const BUFFER_TIME = eventType.buffer_time || 0;

    dayAvailability.forEach((avail) => {
      const [startHour, startMin] = avail.start_time.split(':').map(Number);
      const [endHour, endMin] = avail.end_time.split(':').map(Number);

      let currentTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;

      while (currentTime + eventType.duration <= endTime) {
        const timeStr = `${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${(currentTime % 60).toString().padStart(2, '0')}:00`;
        const endTimeMinutes = currentTime + eventType.duration;

        const isBooked = existingBookings?.some((booking) => {
          const [bStartH, bStartM] = booking.start_time.split(':').map(Number);
          const [bEndH, bEndM] = booking.end_time.split(':').map(Number);
          const bookingStart = bStartH * 60 + bStartM;
          const bookingEnd = bEndH * 60 + bEndM;
          return (currentTime < bookingEnd + BUFFER_TIME) && (endTimeMinutes > bookingStart - BUFFER_TIME);
        });

        if (!isBooked) slots.push(timeStr);
        currentTime += 30;
      }
    });

    setAvailableSlots(slots);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const isDateAvailable = (date: Date) => availability.some(a => a.day_of_week === date.getDay());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !eventType) return;
    setIsSubmitting(true);

    const dateStr = selectedDate.toISOString().split('T')[0];
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const endTimeMinutes = hours * 60 + minutes + eventType.duration;
    const endTimeStr = `${Math.floor(endTimeMinutes / 60).toString().padStart(2, '0')}:${(endTimeMinutes % 60).toString().padStart(2, '0')}:00`;

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        event_type_id: eventType.id,
        booking_date: dateStr,
        start_time: selectedTime,
        end_time: endTimeStr,
        booker_name: bookingForm.name,
        booker_email: bookingForm.email,
        custom_answers: bookingForm.customAnswers,
        status: 'confirmed',
      }])
      .select().single();

    if (!error && data) {
      if (rescheduleId) {
        await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', rescheduleId);
      }
      setTimeout(() => {
        setIsSubmitting(false);
        setStep('confirmed');
        setTimeout(() => setEmailSent(true), 1500); // simulate email arriving
      }, 800);
    } else {
      setIsSubmitting(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center animate-in fade-in">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!eventType) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-xl font-bold text-white">Event not found</h1>
      </div>
    );
  }

  if (step === 'confirmed') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 font-inter">
        <div className="max-w-md w-full bg-[#101010] rounded-[32px] border border-[#1e1e1e] p-10 text-center animate-in zoom-in duration-500 shadow-2xl">
          {emailSent && (
            <div className="absolute top-6 right-6 bg-white/10 border border-white/20 px-4 py-3 rounded-xl flex items-center space-x-3 text-white animate-in slide-left zoom-in duration-300 backdrop-blur-md">
              <Mail className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <p className="text-sm font-bold">Email Sent</p>
                <p className="text-xs text-gray-400">Confirmation dispatched</p>
              </div>
            </div>
          )}

          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 mb-8 border-4 border-black shadow-lg">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{rescheduleId ? 'Meeting rescheduled' : 'This meeting is scheduled'}</h2>
          <p className="text-gray-500 text-[14px] font-medium mb-10">A confirmation email has been sent to {bookingForm.email}.</p>
          
          <div className="text-left space-y-6 mb-10 border-t border-b border-[#1e1e1e] py-8">
            <div className="flex items-start">
              <div className="h-10 w-10 bg-[#1e1e1e] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">Date & Time</p>
                <p className="text-[15px] font-bold text-white">
                  {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-[14px] font-medium text-gray-500">
                  {selectedTime && formatTime(selectedTime)} — {eventType.duration} min
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-4 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 flex flex-col items-center animate-in fade-in font-inter">
      <div className={`
        max-w-5xl w-full bg-[#101010] rounded-[32px] border border-[#1e1e1e] overflow-hidden transition-all duration-500 shadow-2xl flex flex-col md:flex-row
        ${step === 'time' ? 'md:max-w-6xl' : 'md:max-w-4xl'}
      `}>
          {/* Pane 1: Event Details */}
          <div className="md:w-[320px] p-10 flex flex-col border-b md:border-b-0 md:border-r border-[#1e1e1e]">
            <div className="h-12 w-12 rounded-full bg-blue-600 mb-8 flex items-center justify-center text-white text-sm font-bold border-4 border-black shadow-lg">
              AV
            </div>
            <p className="text-[14px] font-bold text-gray-500 mb-1">anushka pal</p>
            <h1 className="text-2xl font-bold text-white mb-6 leading-tight">
              {eventType.title}
            </h1>
            <div className="space-y-4">
              <div className="flex items-center text-[15px] font-bold text-gray-400">
                <Clock className="h-4.5 w-4.5 mr-3" />
                {eventType.duration} min
              </div>
              
              {selectedDate && (
                <div className="flex items-start text-[15px] font-bold text-white animate-in fade-in">
                  <CalendarIcon className="h-4.5 w-4.5 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    {selectedTime && <div className="mt-1 text-blue-500">{formatTime(selectedTime)}</div>}
                  </div>
                </div>
              )}
            </div>

            {eventType.description && (
              <p className="mt-10 text-[14px] text-gray-500 leading-relaxed font-medium">
                {eventType.description}
              </p>
            )}
          </div>

          {/* Pane 2: Calendar Container */}
          <div className={`flex-1 p-10 ${step === 'form' ? 'hidden md:block opacity-30 pointer-events-none' : 'block'}`}>
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-[18px] font-bold text-white">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
               </h2>
               <div className="flex space-x-2">
                 <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2.5 bg-[#1e1e1e] rounded-xl hover:text-white transition-all"
                 >
                   <ChevronLeft className="h-5 w-5" />
                 </button>
                 <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2.5 bg-[#1e1e1e] rounded-xl hover:text-white transition-all"
                 >
                   <ChevronRight className="h-5 w-5" />
                 </button>
               </div>
             </div>

             <div className="grid grid-cols-7 gap-2">
               {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                 <div key={day} className="text-center text-[11px] font-bold text-gray-600 py-4 tracking-widest">{day}</div>
               ))}
               {getDaysInMonth(currentMonth).map((day, idx) => {
                 if (!day) return <div key={`empty-${idx}`} />;
                 const isToday = day.toDateString() === new Date().toDateString();
                 const isPast = day < new Date(new Date().setHours(0,0,0,0));
                 const isAvailable = isDateAvailable(day);
                 const isSelected = selectedDate?.toDateString() === day.toDateString();

                 return (
                   <button
                    key={idx}
                    onClick={() => !isPast && isAvailable && handleDateSelect(day)}
                    disabled={isPast || !isAvailable}
                    className={`
                      aspect-square flex items-center justify-center rounded-2xl text-[15px] font-bold transition-all relative
                      ${isSelected ? 'bg-white text-black shadow-xl ring-4 ring-white/10' : ''}
                      ${!isPast && isAvailable && !isSelected ? 'text-white hover:bg-[#1e1e1e]' : ''}
                      ${isPast || !isAvailable ? 'text-gray-800 cursor-not-allowed' : ''}
                    `}
                   >
                     {day.getDate()}
                     {isToday && !isSelected && <div className="absolute bottom-2 h-1 w-1 bg-blue-500 rounded-full" />}
                   </button>
                 );
               })}
             </div>
          </div>

          {/* Pane 3: Variable Content */}
          {(step === 'time' || step === 'form') && (
            <div className="md:w-[360px] p-10 bg-black animate-in slide-left">
              {step === 'time' && (
                 <div className="space-y-6">
                    <h3 className="text-[18px] font-bold text-white mb-6">Select a time</h3>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {availableSlots.length === 0 ? (
                        <p className="text-gray-600 text-[14px] font-medium">No slots available</p>
                      ) : (
                        availableSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => handleTimeSelect(slot)}
                            className="w-full px-6 py-4 bg-[#101010] border border-[#1e1e1e] rounded-2xl hover:border-white transition-all text-[15px] font-bold text-white flex justify-center items-center shadow-sm"
                          >
                            {formatTime(slot)}
                          </button>
                        ))
                      )}
                    </div>
                 </div>
              )}

              {step === 'form' && (
                <div className="animate-in slide-up">
                  <button onClick={() => setStep('time')} className="mb-8 text-[13px] font-bold text-gray-500 hover:text-white flex items-center transition-all uppercase tracking-widest">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </button>
                  <h3 className="text-xl font-bold text-white mb-8">Details</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3">Name</label>
                      <input 
                        type="text" required value={bookingForm.name}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-black border border-[#252525] focus:border-white text-white rounded-xl px-4 py-3 outline-none transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3">Email</label>
                      <input 
                        type="email" required value={bookingForm.email}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-black border border-[#252525] focus:border-white text-white rounded-xl px-4 py-3 outline-none transition-all font-medium"
                      />
                    </div>
                    {eventType.custom_questions?.map((q, idx) => (
                      <div key={idx}>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3">{q.label}</label>
                        <input 
                          type={q.type || 'text'} required={q.required} value={bookingForm.customAnswers[q.label] || ''}
                          onChange={(e) => setBookingForm(prev => ({ 
                            ...prev, 
                            customAnswers: { ...prev.customAnswers, [q.label]: e.target.value } 
                          }))}
                          className="w-full bg-black border border-[#252525] focus:border-white text-white rounded-xl px-4 py-3 outline-none transition-all font-medium"
                        />
                      </div>
                    ))}
                    <button
                      type="submit" disabled={isSubmitting}
                      className="w-full px-6 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center space-x-3 shadow-xl mt-4 active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <span>Confirm Booking</span>}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
      </div>
      <footer className="mt-12 text-center text-[12px] font-bold text-gray-600">
        <p>powered by <span className="text-white">Cal.com</span></p>
      </footer>
    </div>
  );
}
