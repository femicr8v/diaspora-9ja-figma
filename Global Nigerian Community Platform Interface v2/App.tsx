import { useState } from 'react';
import LandingPage from './components/LandingPage';
import SignInPage from './components/SignInPage';
import RegistrationPage from './components/RegistrationPage';
import WelcomeScreen from './components/WelcomeScreen';
import NewsPage from './components/NewsPage';
import InvestmentPage from './components/InvestmentPage';
import BusinessPage from './components/BusinessPage';
import BlogPage from './components/BlogPage';
import MembershipPage from './components/MembershipPage';
import MembershipDashboard from './components/MembershipDashboard';
import Header from './components/Header';

type PageType = 'landing' | 'signin' | 'registration' | 'welcome' | 'news' | 'investment' | 'business' | 'blog' | 'membership' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremiumMember, setIsPremiumMember] = useState(false);

  const navigateToPage = (page: PageType) => {
    // Protect content pages - redirect to sign in if not logged in
    if (!isLoggedIn && ['news', 'investment', 'business', 'blog', 'membership', 'dashboard'].includes(page)) {
      setCurrentPage('signin');
      return;
    }
    setCurrentPage(page);
  };

  const navigateToSignIn = () => setCurrentPage('signin');
  const navigateToRegistration = () => setCurrentPage('registration');
  const navigateToWelcome = (user: { name: string; email: string }) => {
    setUserData(user);
    setIsLoggedIn(true);
    setCurrentPage('welcome');
  };
  const navigateToLanding = () => setCurrentPage('landing');
  
  const handleSignIn = (user: { name: string; email: string }) => {
    setUserData(user);
    setIsLoggedIn(true);
    // Navigate to news page after successful sign in
    setCurrentPage('news');
  };

  const handleSignOut = () => {
    setUserData(null);
    setIsLoggedIn(false);
    setIsPremiumMember(false);
    setCurrentPage('landing');
  };
  
  const handlePremiumUpgrade = () => {
    setIsPremiumMember(true);
    setCurrentPage('dashboard');
  };

  const showHeader = currentPage !== 'landing' && currentPage !== 'signin' && currentPage !== 'registration' && currentPage !== 'welcome';

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
          onJoinNow={navigateToRegistration}
        />
      )}
      
      {currentPage === 'landing' && (
        <LandingPage 
          onGetStarted={navigateToRegistration} 
          onNavigate={navigateToPage}
          onSignIn={navigateToSignIn}
        />
      )}
      
      {currentPage === 'signin' && (
        <SignInPage 
          onSuccess={handleSignIn} 
          onBack={navigateToLanding}
          onSwitchToSignUp={navigateToRegistration}
        />
      )}
      
      {currentPage === 'registration' && (
        <RegistrationPage 
          onSuccess={navigateToWelcome} 
          onBack={navigateToLanding}
          onSwitchToSignIn={navigateToSignIn}
        />
      )}
      
      {currentPage === 'welcome' && userData && (
        <WelcomeScreen 
          userName={userData.name}
          onBack={navigateToLanding}
          onNavigate={navigateToPage}
        />
      )}

      {/* Protected Content Pages - Only accessible when logged in */}
      {isLoggedIn && (
        <>
          {currentPage === 'news' && (
            <NewsPage 
              isPremium={isPremiumMember} 
              onUpgrade={() => navigateToPage('membership')} 
            />
          )}
          {currentPage === 'investment' && (
            <InvestmentPage 
              isPremium={isPremiumMember} 
              onUpgrade={() => navigateToPage('membership')} 
            />
          )}
          {currentPage === 'business' && (
            <BusinessPage 
              isPremium={isPremiumMember} 
              onUpgrade={() => navigateToPage('membership')} 
            />
          )}
          {currentPage === 'blog' && (
            <BlogPage 
              isPremium={isPremiumMember} 
              onUpgrade={() => navigateToPage('membership')} 
            />
          )}
          {currentPage === 'membership' && (
            <MembershipPage 
              onUpgrade={handlePremiumUpgrade}
              onBack={() => navigateToPage('news')}
              isLoggedIn={isLoggedIn}
            />
          )}
          {currentPage === 'dashboard' && isPremiumMember && (
            <MembershipDashboard 
              userName={userData?.name || 'Member'}
              onNavigate={navigateToPage}
            />
          )}
        </>
      )}
    </div>
  );
}