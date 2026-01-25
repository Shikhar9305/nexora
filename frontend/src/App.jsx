import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/landing"
import SignupPage from "./pages/signup"
import LoginPage from "./pages/login"
import OrganiserOnboarding from "./pages/OrganiserOnboarding"
import PendingApproval from "./pages/PendingApproval"
import UserOnboarding from "./pages/UserOnboarding"
import ExplorePage from "./pages/ExplorePage"


import EventDetailsPage from "./pages/event/EventDetailsPage"
import TeammatePoolPage from "./pages/event/TeammatePoolPage"
import EventRegistrationPage from "./pages/event/EventRegistrationPage"


// organiser dashboard layout
import DashboardLayout from "./components/organiser/DashboardLayout"

// organiser pages
import DashboardPage from "./pages/organiser/DashboardPage"
import CreateEventPage from "./pages/organiser/CreateEventPage"
import MyEventsPage from "./pages/organiser/MyEventsPage"
import OrgEventDetailsPage from "./pages/organiser/EventDetailsPage"
import SettingsPage from "./pages/organiser/SettingsPage"


import UserDashboard from "./pages/user/UserDashboard"

import AdminLayout from "./components/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminOrganisers from "./pages/admin/AdminOrganisers"
import AdminEvents from "./pages/admin/AdminEvents"
import AdminUsers from "./pages/admin/AdminUsers"
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        <Route path="/organiser/onboarding" element={<OrganiserOnboarding />} />
      <Route path="/organiser/pending-approval" element={<PendingApproval />} />
      <Route path="/user/onboarding" element={<UserOnboarding />} />
      <Route path="/explore" element={<ExplorePage/>} />
      <Route path="/event/:id" element={<EventDetailsPage />} />
        <Route path="/event/:id/register" element={<EventRegistrationPage />} />
          <Route path="/event/:id/teammates" element={<TeammatePoolPage />} />

       <Route path="/organiser/dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardPage />} />
  <Route path="events" element={<MyEventsPage />} />
  <Route path="events/new" element={<CreateEventPage />} />
  <Route path="events/:id" element={<OrgEventDetailsPage />} />
  <Route path="settings" element={<SettingsPage />} />
</Route>
 
 <Route path="/dashboard" element={<UserDashboard />} />

 {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/admin/organisers" element={<ProtectedAdminRoute><AdminLayout><AdminOrganisers /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/admin/events" element={<ProtectedAdminRoute><AdminLayout><AdminEvents /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/admin/users" element={<ProtectedAdminRoute><AdminLayout><AdminUsers /></AdminLayout></ProtectedAdminRoute>} />
        
       
      </Routes>
    </BrowserRouter>
  )
}

export default App
