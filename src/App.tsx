import { useState } from "react";
import LandingPage from "./components/LandingPage";
import SignInPage from "./components/SignInPage";
import RegistrationPage from "./components/RegistrationPage";
import JoinNowPage from "./components/JoinNowPage";
import PaymentModal from "./components/PaymentModal";
import ThankYouPage from "./components/ThankYouPage";
import WelcomeScreen from "./components/WelcomeScreen";
import NewsPage from "./components/NewsPage";
import InvestmentPage from "./components/InvestmentPage";
import BusinessPage from "./components/BusinessPage";
import BlogPage from "./components/BlogPage";
import MembershipPage from "./components/MembershipPage";
import MembershipDashboard from "./components/MembershipDashboard";
import Header from "./components/Header";

type PageType =
  | "landing"
  | "signin"
  | "registration"
  | "joinnow"
  | "thankyou"
  | "welcome"
  | "news"
  | "investment"
  | "business"
  | "blog"
  | "membership"
  | "dashboard";

interface UserData {
  name: string;
  email: string;
  phone?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("landing");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremiumMember, setIsPremiumMember] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [joinFormData, setJoinFormData] = useState<{
    fullName: string;
    email: string;
    phone: string;
  } | null>(null);

  const navigateToPage = (page: PageType) => {
    // Protect content pages - redirect to sign in if not logged in
    if (
      !isLoggedIn &&
      [
        "news",
        "investment",
        "business",
        "blog",
        "membership",
        "dashboard",
      ].includes(page)
    ) {
      setCurrentPage("signin");
      return;
    }
    setCurrentPage(page);
  };

  const navigateToSignIn = () => setCurrentPage("signin");
  const navigateToRegistration = () => setCurrentPage("registration");
  const navigateToJoinNow = () => setCurrentPage("joinnow");
  const navigateToLanding = () => setCurrentPage("landing");

  // Handle the new join flow
  const handleShowPayment = (formData: {
    fullName: string;
    email: string;
    phone: string;
  }) => {
    setJoinFormData(formData);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (joinFormData) {
      // Set user data and mark as premium member
      setUserData({
        name: joinFormData.fullName,
        email: joinFormData.email,
        phone: joinFormData.phone,
      });
      setIsLoggedIn(true);
      setIsPremiumMember(true);
      setShowPaymentModal(false);
      setCurrentPage("thankyou");
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setJoinFormData(null);
  };

  // Existing handlers
  const navigateToWelcome = (user: { name: string; email: string }) => {
    setUserData(user);
    setIsLoggedIn(true);
    setCurrentPage("welcome");
  };

  const handleSignIn = (user: { name: string; email: string }) => {
    setUserData(user);
    setIsLoggedIn(true);
    // Navigate to news page after successful sign in
    setCurrentPage("news");
  };

  const handleSignOut = () => {
    setUserData(null);
    setIsLoggedIn(false);
    setIsPremiumMember(false);
    setCurrentPage("landing");
  };

  const handlePremiumUpgrade = () => {
    setIsPremiumMember(true);
    setCurrentPage("dashboard");
  };

  const handleGoToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const showHeader =
    currentPage !== "landing" &&
    currentPage !== "signin" &&
    currentPage !== "registration" &&
    currentPage !== "joinnow" &&
    currentPage !== "thankyou" &&
    currentPage !== "welcome";

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <Header
          currentPage={currentPage}
          onNavigate={navigateToPage}
          isLoggedIn={isLoggedIn}
          isPremiumMember={isPremiumMember}
          userName={userData?.name}
          onSignOut={handleSignOut}
          onJoinNow={navigateToJoinNow}
        />
      )}

      {currentPage === "landing" && (
        <LandingPage
          onGetStarted={navigateToJoinNow}
          onNavigate={navigateToPage}
          onSignIn={navigateToSignIn}
        />
      )}

      {currentPage === "joinnow" && (
        <JoinNowPage
          onBack={navigateToLanding}
          onShowPayment={handleShowPayment}
        />
      )}

      {currentPage === "thankyou" && userData && (
        <ThankYouPage
          userName={userData.name}
          onGoToDashboard={handleGoToDashboard}
          onReturnHome={navigateToLanding}
        />
      )}

      {currentPage === "signin" && (
        <SignInPage
          onSuccess={handleSignIn}
          onBack={navigateToLanding}
          onSwitchToSignUp={navigateToRegistration}
        />
      )}

      {currentPage === "registration" && (
        <RegistrationPage
          onSuccess={navigateToWelcome}
          onBack={navigateToLanding}
          onSwitchToSignIn={navigateToSignIn}
        />
      )}

      {currentPage === "welcome" && userData && (
        <WelcomeScreen
          userName={userData.name}
          onBack={navigateToLanding}
          onNavigate={navigateToPage}
        />
      )}

      {/* Protected Content Pages - Only accessible when logged in */}
      {isLoggedIn && (
        <>
          {currentPage === "news" && (
            <NewsPage
              isPremium={isPremiumMember}
              onUpgrade={() => navigateToPage("membership")}
            />
          )}
          {currentPage === "investment" && (
            <InvestmentPage
              isPremium={isPremiumMember}
              onUpgrade={() => navigateToPage("membership")}
            />
          )}
          {currentPage === "business" && (
            <BusinessPage
              isPremium={isPremiumMember}
              onUpgrade={() => navigateToPage("membership")}
            />
          )}
          {currentPage === "blog" && (
            <BlogPage
              isPremium={isPremiumMember}
              onUpgrade={() => navigateToPage("membership")}
            />
          )}
          {currentPage === "membership" && (
            <MembershipPage
              onUpgrade={handlePremiumUpgrade}
              onBack={() => navigateToPage("news")}
              isLoggedIn={isLoggedIn}
            />
          )}
          {currentPage === "dashboard" && isPremiumMember && (
            <MembershipDashboard
              userName={userData?.name || "Member"}
              onNavigate={navigateToPage}
            />
          )}
        </>
      )}

      {/* Payment Modal */}
      {showPaymentModal && joinFormData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handleClosePaymentModal}
          onSuccess={handlePaymentSuccess}
          userInfo={joinFormData}
        />
      )}
    </div>
  );
}
