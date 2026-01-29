import React, { useState, useEffect } from "react";
// 1. Import Router Hooks
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";

import SplashScreen from "./components/SplashScreen";

import OnboardingScreens from "./components/OnboardingScreens";
import LoginSignup from "./components/LoginSignup";
import ProviderSignup from "./components/ProviderSignup";
import ProviderDashboard from "./components/ProviderDashboard";
import HomeScreen from "./components/HomeScreen";
import CategoryListing from "./components/CategoryListing";
import ProviderDetails from "./components/ProviderDetails";
import EventPlanner from "./components/EventPlanner"; // 👈 Your New Page
import BookingConfirmation from "./components/BookingConfirmation";
import UserProfile from "./components/UserProfile";
import NotificationsChat from "./components/NotificationsChat";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import PaymentScreen from "./components/PaymentScreen";
import OnlinePaymentGateway from "./components/OnlinePaymentGateway";
export type UserType = "user" | "provider";

export interface ServiceProvider {
  id: string;
  name: string;
  fullName?: string;
  category: string;
  rating: number;
  location: string;
  distance: string;
  avatar: string;
  bio: string;
  experience: number;
  cost: string;
  availability: string;
  images: string[];
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Global State
  const [userType, setUserType] = useState<UserType>("user");
  const [userName, setUserName] = useState<string>("");
  const [providerCategory, setProviderCategory] = useState<string>("");

  // State for passing data between screens (Legacy support)
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  // 🔄 SMART AUTO-LOGIN LOGIC
  useEffect(() => {
    // Only run check if we are at root "/"
    if (location.pathname === "/") {
      const checkToken = async () => {
        const token = localStorage.getItem('token');
        const savedUserType = localStorage.getItem('userType') as UserType;
        const savedName = localStorage.getItem('userName');

        if (token && savedName) {
          // 🛑 Validate Token API Call Here (Same as your logic)
          // For demo speed, assuming valid if token exists:
          console.log("Auto-login success:", savedName);
          setUserName(savedName);
          setUserType(savedUserType || 'user');

          // Navigate based on type
          if (savedUserType === 'provider') {
            navigate('/provider-dashboard');
          } else {
            navigate('/home');
          }
        } else {
          navigate('/onboarding');
        }
      };

      const timer = setTimeout(checkToken, 3000);
      return () => clearTimeout(timer);
    }
  }, []); // Run once on mount

  // 🚪 LOGOUT LOGIC
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    setUserName("");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* 1. Splash Screen (Root) */}
        <Route path="/" element={<SplashScreen />} />

        {/* 2. Auth Flow */}
        <Route path="/onboarding" element={
          <OnboardingScreens onComplete={() => navigate('/login')} />
        } />

        <Route path="/login" element={
          <LoginSignup
            onLogin={(name, type) => {
              localStorage.setItem('userName', name);
              localStorage.setItem('userType', type);
              setUserName(name);
              setUserType(type);
              navigate(type === "provider" ? '/provider-dashboard' : '/home');
            }}
            onProviderSignup={() => navigate('/provider-signup')}
            onAdminAccess={() => navigate('/admin-login')}
          />
        } />

        <Route path="/provider-signup" element={
          <ProviderSignup
            onSignupComplete={(user) => {
              setUserName(user.name);
              setProviderCategory(user.category);
              setUserType("provider");
              navigate('/provider-dashboard');
            }}
            onBack={() => navigate('/login')}
          />
        } />

        <Route path="/admin-login" element={
          <AdminLogin
            onLogin={() => navigate('/admin-dashboard')}
            onBack={() => navigate('/login')}
          />
        } />

        <Route path="/admin-dashboard" element={
          <AdminDashboard onLogout={() => navigate('/admin-login')} />
        } />

        {/* 3. Provider Flow */}
        <Route path="/provider-dashboard" element={
          <ProviderDashboard
            providerName={userName}
            providerCategory={providerCategory}
            onBack={handleLogout}
          />
        } />

        {/* 4. User Flow (Home) */}
        <Route path="/home" element={
          <HomeScreen
            userName={userName}
            onCategorySelect={(category) => {
              setSelectedCategory(category);
              navigate('/category');
            }}
            onPlanEvent={() => navigate('/plan-event')} // 👈 Direct link if needed
            onProfileClick={() => navigate('/user-profile')}
            onNotificationsClick={() => navigate('/chat')}
          />
        } />

        <Route path="/category" element={
          <CategoryListing
            category={selectedCategory}
            onBack={() => navigate('/home')}
            onProviderSelect={(provider) => {
              setSelectedProvider(provider);
              navigate(`/provider/${provider.id}`); // URL-based routing
            }}
          />
        } />

        {/* 5. Provider Details & Booking */}
        <Route path="/provider/:id" element={
          selectedProvider ? (
            <ProviderDetails
              provider={selectedProvider}
              onBack={() => navigate('/category')}
              onBookNow={() => {
                // The Modal inside ProviderDetails will handle the navigation to /plan-event
                console.log("Opening Booking Modal...");
              }}
            />
          ) : (
            <Navigate to="/home" /> // Redirect if no provider selected (safety)
          )
        } />

        {/* 🚀 6. NEW: Event Planner Page */}
        <Route path="/plan-event" element={
          <EventPlanner />
          // No props needed! It reads from URL parameters now.
        } />

        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/online-gateway" element={<OnlinePaymentGateway />} />
        <Route path="/confirmation" element={
          <BookingConfirmation
            cartItems={[]} // Reset for now
            onBackToHome={() => navigate('/home')}
          />
        } />

        {/* 7. Extras */}
        <Route path="/user-profile" element={
          <UserProfile
            userName={userName}
            onBack={() => navigate('/home')}
          />
        } />

        <Route path="/chat" element={
          <NotificationsChat onBack={() => navigate('/home')} />
        } />

      </Routes>
    </div>
  );
}

export default App;