import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Newspaper, 
  TrendingUp, 
  Briefcase, 
  BookOpen, 
  User,
  Menu,
  X,
  Crown,
  LayoutDashboard,
  LogOut
} from "lucide-react";
import { useState } from "react";
import logoImage from 'figma:asset/0be1b3fe61946b6a71598093280579589812311d.png';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: 'landing' | 'news' | 'investment' | 'business' | 'blog' | 'membership' | 'dashboard') => void;
  isLoggedIn?: boolean;
  isPremiumMember?: boolean;
  userName?: string;
  onSignOut?: () => void;
  onJoinNow?: () => void;
}

export default function Header({ currentPage, onNavigate, isLoggedIn, isPremiumMember, userName, onSignOut, onJoinNow }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'news', label: 'Latest News', icon: Newspaper },
    { id: 'investment', label: 'Investments', icon: TrendingUp },
    { id: 'business', label: 'Business Ads', icon: Briefcase },
    { id: 'blog', label: 'Blog', icon: BookOpen },
  ];

  const handleNavigate = (page: any) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    setIsMobileMenuOpen(false);
    if (onSignOut) {
      onSignOut();
    }
  };

  const handleJoinNow = () => {
    setIsMobileMenuOpen(false);
    if (onJoinNow) {
      onJoinNow();
    }
  };

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => handleNavigate('landing')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="Diaspora 9ja Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold text-primary font-headers">Diaspora 9ja</span>
              <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20 px-2 py-0">
                Community Platform
              </Badge>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  onClick={() => handleNavigate(item.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
            
            {/* Premium Dashboard */}
            {isPremiumMember && (
              <Button
                variant={currentPage === 'dashboard' ? "secondary" : "ghost"}
                onClick={() => handleNavigate('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 ${
                  currentPage === 'dashboard' ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
            )}

            {/* Join Now Button - Always visible as last nav item */}
            {!isLoggedIn && (
              <Button
                onClick={handleJoinNow}
                className="bg-primary hover:bg-primary/90 text-primary-foreground ml-4"
              >
                Join Now
              </Button>
            )}
          </nav>

          {/* User Section & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {isLoggedIn && userName && (
              <div className="hidden sm:flex items-center space-x-3">
                {isPremiumMember ? (
                  <div className="flex items-center space-x-2 bg-accent/10 text-accent px-3 py-2 rounded-lg border border-accent/20">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-medium">Premium</span>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigate('membership')}
                    className="border-accent/20 text-accent hover:bg-accent/5"
                  >
                    <Crown className="w-4 h-4 mr-1" />
                    Upgrade
                  </Button>
                )}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Welcome, {userName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border/40 pt-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    onClick={() => handleNavigate(item.id as any)}
                    className={`flex items-center space-x-3 px-4 py-3 justify-start w-full ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              
              {/* Premium Dashboard Mobile */}
              {isPremiumMember && (
                <Button
                  variant={currentPage === 'dashboard' ? "secondary" : "ghost"}
                  onClick={() => handleNavigate('dashboard')}
                  className={`flex items-center space-x-3 px-4 py-3 justify-start w-full ${
                    currentPage === 'dashboard' ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Button>
              )}

              {/* Join Now Button Mobile */}
              {!isLoggedIn && (
                <Button
                  onClick={handleJoinNow}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground mx-4 mt-4"
                >
                  Join Now
                </Button>
              )}
              
              {isLoggedIn && userName && (
                <div className="flex flex-col space-y-3 px-4 py-3 border-t border-border/40 mt-4 pt-4">
                  {isPremiumMember ? (
                    <div className="flex items-center space-x-2 bg-accent/10 text-accent px-3 py-2 rounded-lg border border-accent/20 w-fit">
                      <Crown className="w-4 h-4" />
                      <span className="text-sm font-medium">Premium Member</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleNavigate('membership')}
                      className="border-accent/20 text-accent hover:bg-accent/5 w-fit"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Welcome, {userName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="text-destructive hover:bg-destructive/10 w-fit"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}