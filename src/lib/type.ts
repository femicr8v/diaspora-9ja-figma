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
