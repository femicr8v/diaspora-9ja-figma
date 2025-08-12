import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { ArrowLeft, Mail, Lock, User, AlertCircle } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/0be1b3fe61946b6a71598093280579589812311d.png';

interface RegistrationPageProps {
  onSuccess: (userData: { name: string; email: string }) => void;
  onBack: () => void;
  onSwitchToSignIn: () => void;
}

export default function RegistrationPage({ onSuccess, onBack, onSwitchToSignIn }: RegistrationPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    onSuccess({ name: formData.name, email: formData.email });
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleOAuthSignup = (provider: 'google' | 'linkedin') => {
    // Mock OAuth flow - in real app, this would redirect to OAuth provider
    console.log(`Initiating ${provider} OAuth flow`);
    onSuccess({ 
      name: `${provider === 'google' ? 'Google' : 'LinkedIn'} User`, 
      email: `user@${provider === 'google' ? 'gmail.com' : 'linkedin.com'}` 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Registration Card */}
        <Card className="border-border/40 shadow-xl bg-background/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="Diaspora 9ja Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <CardTitle className="text-2xl text-primary">Join Diaspora 9ja</CardTitle>
            </div>
            <p className="text-muted-foreground">
              Connect with Nigerians worldwide and access trusted resources
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-11 border-border/40 hover:bg-secondary/50"
                onClick={() => handleOAuthSignup('google')}
              >
                <ImageWithFallback
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="w-5 h-5 mr-3"
                />
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                className="w-full h-11 border-border/40 hover:bg-secondary/50"
                onClick={() => handleOAuthSignup('linkedin')}
              >
                <div className="w-5 h-5 bg-blue-600 rounded mr-3 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                Continue with LinkedIn
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground">or continue with email</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    className={`pl-10 h-11 ${errors.name ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.name && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription className="text-sm">{errors.name}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    className={`pl-10 h-11 ${errors.email ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.email && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription className="text-sm">{errors.email}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className={`pl-10 h-11 ${errors.password ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.password && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription className="text-sm">{errors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button 
                onClick={onSwitchToSignIn}
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              By creating an account, you agree to our{' '}
              <a href="#terms" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#privacy" className="text-primary hover:underline">Privacy Policy</a>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">Trusted by thousands of Nigerians worldwide</p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              Secure
            </div>
            <div className="flex items-center">
              <img 
                src={logoImage} 
                alt="Diaspora 9ja" 
                className="w-3 h-3 mr-1 object-contain"
              />
              Global Community
            </div>
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              Verified Members
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}