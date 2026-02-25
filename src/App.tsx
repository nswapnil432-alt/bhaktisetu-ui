import React, { useState, useEffect } from "react";
// 1. Import Router Hooks
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";

// Components
import SplashScreen from "./components/SplashScreen";
import OnboardingScreens from "./components/OnboardingScreens";
import LoginSignup from "./components/LoginSignup";
import ProviderSignup from "./components/ProviderSignup";
import ProviderDashboard from "./components/ProviderDashboard";
import HomeScreen from "./components/HomeScreen";
import CategoryListing from "./components/CategoryListing";
import ProviderDetails from "./components/ProviderDetails";
import EventPlanner from "./components/EventPlanner";
import BookingConfirmation from "./components/BookingConfirmation";
import UserProfile from "./components/UserProfile";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import PaymentScreen from "./components/PaymentScreen";
import OnlinePaymentGateway from "./components/OnlinePaymentGateway";
import MyBookings from "./components/MyBookings";
import NotificationToast from "./components/NotificationToast"; // ✅ Imported
import EditProviderProfile from './components/EditProviderProfile'; // (Adjust the path if your folder is different)
import UserSignup from "./components/UserSignup";
export type UserType = "user" | "provider" | "admin";

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

  // State for passing data between screens
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  // 🔄 SMART AUTO-LOGIN LOGIC
  useEffect(() => {
    if (location.pathname === "/") {
      const checkToken = async () => {
        const token = localStorage.getItem('token');
        const savedUserType = localStorage.getItem('userType') as UserType;
        const savedName = localStorage.getItem('userName');

        if (token && savedName) {
          console.log("Auto-login success:", savedName);
          setUserName(savedName);
          setUserType(savedUserType || 'user');

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
  }, []);

  // 🚪 LOGOUT LOGIC
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    setUserName("");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white relative"> {/* Added relative for positioning */}

      {/* 🔔 GLOBAL NOTIFICATION TOAST */}
      {/* This sits outside Routes so it works on EVERY page */}
      <NotificationToast />

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
              if (type === 'admin') {
                navigate('/admin-dashboard');
              } else if (type === 'provider') {
                navigate('/provider-dashboard');
              } else {
                navigate('/home'); // Or wherever normal users go
              }
            }}
            onProviderSignup={() => navigate('/provider-signup')}
            onUserSignup={() => navigate('/user-signup')} // The new User Registration page we will build!
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
            // @ts-ignore
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
            onPlanEvent={() => navigate('/plan-event')}
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
              navigate(`/provider/${provider.id}`);
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
                console.log("Opening Booking Modal...");
              }}
            />
          ) : (
            <Navigate to="/home" />
          )
        } />

        <Route path="/plan-event" element={<EventPlanner />} />

        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/online-gateway" element={<OnlinePaymentGateway />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/confirmation" element={
          <BookingConfirmation
            onBackToHome={() => navigate('/home')}
          />
        } />

        <Route path="/edit-profile" element={
          <EditProviderProfile
          />
        } />

        {/* 7. Extras */}
        <Route path="/user-profile" element={
          <UserProfile
            userName={userName}
            onBack={() => navigate('/home')}
          />
        } />

        <Route path="/user-signup" element={<UserSignup />} />

      </Routes>

    </div>
  );
}

export default App;