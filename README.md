# Scheduling Platform (Cal.com Clone)

This is a functional scheduling/booking web application . It closely replicates Cal.com's premium design, layout, and user experience, allowing users to create event types, set their availability, and let others book time slots through a public booking page.

## ✨ Key Features (Core Requirements Met)

*   **Event Types Management:** Create, Edit, Duplicate, and Delete public event types with descriptions, titles, and unique URL slugs.
*   **Dynamic Availability Settings:** Select available days of the week, specify valid time ranges, and automatically handle timezone differences.
*   **Public Booking Flow:** A responsive calendar viewer that matches the host's event duration and availability to display open slot options. Avoids double-bookings. Collects basic booker information.
*   **Bookings Dashboard:** Delineation between upcoming and past commitments. Includes functionality to cancel reservations.
*   **Dark Mode Premium UI:** Built to feel identical to the actual Cal.com interface.

## 🌟 Bonus Features Implemented
*   **Responsive Design:** Fully fluid interfaces rendering perfectly across Mobile, Tablet, and Desktop.
*   **Buffer Time:** System optionally inserts blocks of padding before and after meetings.
*   **Custom Booking Questions:** Event-creators can ask text-based, required/optional questions during the confirmation step.
*   **Rescheduling Flow:** Existing meetings can trigger a dedicated rescheduling process.
*   **Email Notifications:** A simulated email dispatch is triggered upon booking confirmation.
*   **Date Overrides & Multiple Schedules:** Accommodated deeply inside the database schema to handle varying schedules via references.

## 🛠️ Technical Stack

*   **Frontend:** React 18 (Vite, Single Page Application)
*   **Language:** TypeScript 
*   **Styling:** Tailwind CSS (for replication of Cal.com design tokens)
*   **Backend & Database:** Supabase (PostgreSQL implementation as a dynamic BaaS resolving API requirements through the Supabase JS Client)


## 🚀 Local Setup & Installation

### 1. Clone the repository
```bash
git clone 
cd Scheduling-Platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
To connect to the database, you need to set up your Supabase credentials. Create a `.env` file in the root of the project to hook into the live deployment:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Schema Overview
The PostgreSQL database consists of the following core normalized architecture (enforced via RLS constraints):
*   `event_types`: `id`, `title`, `description`, `duration`, `slug`, `color`, `buffer_time`, `custom_questions` (JSONB), timestamps.
*   `availability`: `id`, `day_of_week`, `start_time`, `end_time`, `timezone`, timestamps.
*   `bookings`: `id`, `event_type_id`, `booking_date`, `start_time`, `end_time`, `booker_name`, `booker_email`, `status`, `custom_answers` (JSONB), `rescheduled_from_id`, timestamps.
*   Additional schema tables added for bonus functionality (multiple schedules/date blocks): `schedules`, `schedule_availability`, `date_overrides`.

*You can execute the schema and seed files located in `/supabase/migrations/` natively within the Supabase SQL Editor.*

### 5. Run the Local Development Server
```bash
npm run dev
```
The application will be running at `http://localhost:5173`. Open it in your web browser.

---
*Developed by Anushka Pal*
