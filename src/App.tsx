import React, { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import OnboardingScreens from "./components/OnboardingScreens";
import LoginSignup from "./components/LoginSignup";
import ProviderSignup from "./components/ProviderSignup";
import ProviderDashboard from "./components/ProviderDashboard";
import HomeScreen from "./components/HomeScreen";
import CategoryListing from "./components/CategoryListing";
import ServiceProviderProfile from "./components/ServiceProviderProfile";
import EventPlanner from "./components/EventPlanner";
import BookingConfirmation from "./components/BookingConfirmation";
import UserProfile from "./components/UserProfile";
import NotificationsChat from "./components/NotificationsChat";

export type Screen =
  | "splash"
  | "onboarding"
  | "login"
  | "provider-signup"
  | "provider-dashboard"
  | "home"
  | "category"
  | "profile"
  | "planner"
  | "confirmation"
  | "user-profile"
  | "chat";

export type UserType = "user" | "provider";

export interface ServiceProvider {
  id: string;
  name: string;
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

export interface CartItem {
  provider: ServiceProvider;
  date: string;
  time: string;
}

function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("splash");
  const [userType, setUserType] = useState<UserType>("user");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("");
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProvider | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [providerCategory, setProviderCategory] =
    useState<string>("");

  // Auto-transition from splash to onboarding
  React.useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        setCurrentScreen("onboarding");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleAddToCart = (
    provider: ServiceProvider,
    date: string,
    time: string,
  ) => {
    setCartItems([...cartItems, { provider, date, time }]);
    setCurrentScreen("planner");
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen />;
      case "onboarding":
        return (
          <OnboardingScreens
            onComplete={() => setCurrentScreen("login")}
          />
        );
      case "login":
        return (
          <LoginSignup
            onLogin={(name, type) => {
              setUserName(name);
              setUserType(type);
              if (type === "provider") {
                setCurrentScreen("provider-dashboard");
              } else {
                setCurrentScreen("home");
              }
            }}
            onProviderSignup={() =>
              setCurrentScreen("provider-signup")
            }
          />
        );
      case "provider-signup":
        return (
          <ProviderSignup
            onSignupComplete={(name, category) => {
              setUserName(name);
              setProviderCategory(category);
              setUserType("provider");
              setCurrentScreen("provider-dashboard");
            }}
            onBack={() => setCurrentScreen("login")}
          />
        );
      case "provider-dashboard":
        return (
          <ProviderDashboard
            providerName={userName}
            providerCategory={providerCategory}
            onBack={() => setCurrentScreen("login")}
          />
        );
      case "home":
        return (
          <HomeScreen
            userName={userName}
            onCategorySelect={(category) => {
              setSelectedCategory(category);
              setCurrentScreen("category");
            }}
            onPlanEvent={() => setCurrentScreen("planner")}
            onProfileClick={() =>
              setCurrentScreen("user-profile")
            }
            onNotificationsClick={() =>
              setCurrentScreen("chat")
            }
          />
        );
      case "category":
        return (
          <CategoryListing
            category={selectedCategory}
            onBack={() => setCurrentScreen("home")}
            onProviderSelect={(provider) => {
              setSelectedProvider(provider);
              setCurrentScreen("profile");
            }}
          />
        );
      case "profile":
        return selectedProvider ? (
          <ServiceProviderProfile
            provider={selectedProvider}
            onBack={() => setCurrentScreen("category")}
            onBook={handleAddToCart}
          />
        ) : null;
      case "planner":
        return (
          <EventPlanner
            cartItems={cartItems}
            onBack={() => setCurrentScreen("home")}
            onConfirm={() => setCurrentScreen("confirmation")}
            onClearCart={handleClearCart}
          />
        );
      case "confirmation":
        return (
          <BookingConfirmation
            cartItems={cartItems}
            onBackToHome={() => {
              setCurrentScreen("home");
              handleClearCart();
            }}
          />
        );
      case "user-profile":
        return (
          <UserProfile
            userName={userName}
            onBack={() => setCurrentScreen("home")}
          />
        );
      case "chat":
        return (
          <NotificationsChat
            onBack={() => setCurrentScreen("home")}
          />
        );
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderScreen()}
    </div>
  );
}

export default App;