import { LucideIcon } from "lucide-react";

export interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  gradient: string;
  stats: string;
  features: string[];
}

export interface CommunityStat {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
}

export interface AboutStat {
  number: string;
  label: string;
  icon: LucideIcon;
}

export interface CommunityProfile {
  name: string;
  role: string;
  location: string;
  image: string;
  industry: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ContactMethod {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  action: string;
}

export interface NavigationLink {
  href: string;
  label: string;
}

export interface AboutCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  features: string[];
}

export interface JoinNowPageBenefits {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight: string;
}

export interface TrustIndicator {
  number: string;
  label: string;
  icon: LucideIcon;
}

export interface Country {
  code: string;
  country: string;
  flag: string;
}

export interface SecurityFeature {
  icon: LucideIcon;
  text: string;
  color: string;
}

export interface FormConfig {
  title: string;
  subtitle: string;
  submitButtonText: string;
  processingText: string;
  legalText: {
    prefix: string;
    termsLink: {
      text: string;
      href: string;
    };
    and: string;
    privacyLink: {
      text: string;
      href: string;
    };
  };
}

export interface JoinNowFormFormData {
  fullName: string;
  email: string;
  location: string;
  countryCode: string;
  phone: string;
}

export interface JoinNowFormControls {
  name: keyof JoinNowFormFormData;
  label: string;
  placeholder: string;
  type: "text" | "email" | "tel" | "select";
  required: boolean;
  validation?: any;
  options?: Array<{ value: string; label: string; flag?: string }>;
}
