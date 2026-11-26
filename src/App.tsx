import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EventTypeForm from './pages/EventTypeForm';
import Availability from './pages/Availability';
import Bookings from './pages/Bookings';
import PublicBooking from './pages/PublicBooking';
import Workflows from './pages/Workflows';
import Teams from './pages/Teams';
import Apps from './pages/Apps';
import Routing from './pages/Routing';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Refer from './pages/Refer';
import PublicProfile from './pages/PublicProfile';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="event-types/new" element={<EventTypeForm />} />
          <Route path="event-types/:id/edit" element={<EventTypeForm />} />
          <Route path="availability" element={<Availability />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="teams" element={<Teams />} />
          <Route path="apps" element={<Apps />} />
          <Route path="apps/store" element={<Apps />} />
          <Route path="apps/installed" element={<Apps />} />
          <Route path="routing" element={<Routing />} />
          <Route path="insights" element={<Insights />} />
          <Route path="insights/bookings" element={<Insights />} />
          <Route path="insights/routing" element={<Insights />} />
          <Route path="insights/router-position" element={<Insights />} />
          <Route path="insights/call-history" element={<Insights />} />
          <Route path="insights/wrong-routing" element={<Insights />} />
          <Route path="settings" element={<Settings />} />
          <Route path="refer" element={<Refer />} />
        </Route>
        <Route path="/:slug" element={<PublicBooking />} />
        <Route path="/u/:username" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
