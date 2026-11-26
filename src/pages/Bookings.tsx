import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Filter, ChevronDown, Repeat } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BookingWithEventType {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  booker_name: string;
  booker_email: string;
  status: 'confirmed' | 'cancelled';
  created_at: string;
  event_types: {
    title: string;
    duration: number;
    color: string;
  };
}

export default function Bookings() {
  const [upcomingBookings, setUpcomingBookings] = useState<BookingWithEventType[]>([]);
  const [pastBookings, setPastBookings] = useState<BookingWithEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'unconfirmed' | 'recurring' | 'past' | 'canceled'>('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data } = await supabase
      .from('bookings')
      .select(
        `
        *,
        event_types (
          title,
          duration,
          color
        )
      `
      )
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (data) {
      const upcoming = data.filter(
        (booking) =>
          booking.booking_date >= today && booking.status === 'confirmed'
      );
      const past = data.filter(
        (booking) =>
          booking.booking_date < today || booking.status === 'cancelled'
      );

      setUpcomingBookings(upcoming as BookingWithEventType[]);
      setPastBookings(past as BookingWithEventType[]);
    }

    setLoading(false);
  };

  const cancelBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id);
    
    if (!error) {
      alert("Booking cancelled successfully.");
      loadBookings();
    }
  };

  const handleReschedule = (booking: BookingWithEventType) => {
    navigate(`/${booking.event_types.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${booking.id}?reschedule=${booking.id}`);
    alert(`In a real app, this takes you to /${booking.event_types.title} with the booking ID to reschedule!`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getGroupedBookings = () => {
    const grouped: { [key: string]: BookingWithEventType[] } = {};
    const bookingsToShow = activeTab === 'upcoming' ? upcomingBookings : (activeTab === 'past' ? pastBookings : []);
    
    bookingsToShow.forEach((booking) => {
      const date = booking.booking_date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(booking);
    });
    
    return Object.entries(grouped).sort(([a], [b]) => {
      return activeTab === 'upcoming' 
        ? a.localeCompare(b) 
        ? a.localeCompare(b) : 1
        : b.localeCompare(a);
    });
  };

  const groupedBookings = getGroupedBookings();
  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'unconfirmed', label: 'Unconfirmed' },
    { id: 'recurring', label: 'Recurring' },
    { id: 'past', label: 'Past' },
    { id: 'canceled', label: 'Canceled' },
  ];

  return (
    <div className="animate-in fade-in">
      <div className="mb-10 animate-in slide-up">
        <h1 className="text-2xl font-bold text-white tracking-tight">Bookings</h1>
        <p className="mt-1 text-sm text-gray-500 font-medium">
          See upcoming and past events booked through your event type links.
        </p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-up">
        <div className="flex flex-wrap items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-[16px] font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button className="flex items-center px-3 py-1.5 text-[14px] font-bold text-gray-500 hover:text-white border border-transparent hover:border-[#1e1e1e] rounded-md transition-all">
            <Filter className="w-3.5 h-3.5 mr-2" />
            Filter
          </button>
        </div>
        
        <button className="flex items-center px-3 py-1.5 text-[14px] font-bold text-gray-500 hover:text-white transition-all bg-[#101010] border border-[#1e1e1e] rounded-md shadow-sm">
          <Filter className="w-3.5 h-3.5 mr-2" />
          Saved filters
          <ChevronDown className="w-3.5 h-3.5 ml-2" />
        </button>
      </div>

      <div className="space-y-12 pb-24">
        {groupedBookings.length === 0 ? (
          <div className="text-center py-24 bg-[#101010] rounded-xl border border-[#1e1e1e] border-dashed animate-in slide-up max-w-5xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 bg-[#1e1e1e] rounded-full flex items-center justify-center mb-6">
              <Calendar className="h-8 w-8 text-gray-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No upcoming bookings</h3>
            <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto leading-relaxed">
              You have no upcoming bookings. As soon as someone books a time with you it will show up here.
            </p>
          </div>
        ) : (
          groupedBookings.map(([date, items], groupIdx) => (
            <div key={date} className="animate-in slide-up" style={{ animationDelay: `${groupIdx * 100}ms` }}>
              <div className="flex items-center space-x-4 mb-6">
                <h2 className="text-[14px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                  {formatDate(date)}
                </h2>
                <div className="h-px bg-[#1e1e1e] w-full" />
              </div>
              <div className="bg-[#101010] border border-[#1e1e1e] rounded-xl overflow-hidden divide-y divide-[#1e1e1e]">
                {items.map((booking) => (
                  <div
                    key={booking.id}
                    className="group px-6 py-5 hover:bg-[#151515] transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-6 min-w-0">
                      <div className="flex flex-col items-center justify-center w-12 text-center flex-shrink-0">
                        <span className="text-[15px] font-bold text-white">
                          {booking.start_time.split(':')[0]}:{booking.start_time.split(':')[1]}
                        </span>
                        <span className="text-[12px] font-bold text-gray-600 uppercase">
                          {parseInt(booking.start_time.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                        </span>
                      </div>
                      
                      <div className="h-10 w-1 bg-gray-500 rounded-full" style={{ backgroundColor: booking.event_types.color }} />

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-[18px] font-bold text-white truncate">
                            {booking.event_types.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-[16px] font-medium text-gray-400 truncate">
                            {booking.booker_name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 ml-4">
                      {activeTab === 'upcoming' && (
                        <>
                          <button 
                            onClick={() => cancelBooking(booking.id)}
                            className="px-4 py-2 border border-transparent text-gray-400 rounded-lg text-sm font-bold hover:bg-red-950/30 hover:text-red-500 transition-all"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleReschedule(booking)}
                            className="px-4 py-2 border border-transparent text-gray-400 rounded-lg text-sm font-bold hover:bg-[#1e1e1e] hover:text-white transition-all flex items-center"
                          >
                            <Repeat className="w-3.5 h-3.5 mr-1" />
                            Reschedule
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => alert(`Details for ${booking.booker_name}'s booking on ${booking.booking_date}`)}
                        className="px-4 py-2 border border-[#1e1e1e] text-gray-400 rounded-lg text-xs font-bold hover:bg-[#1e1e1e] hover:text-white transition-all"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
