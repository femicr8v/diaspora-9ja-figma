import {
  Users,
  MessageCircle,
  Star,
  Newspaper,
  TrendingUp,
  Briefcase,
  BookOpen,
  Heart,
  Mail,
  Phone,
  Globe,
  Award,
  MessageSquare,
  Target,
  Eye,
} from "lucide-react";

import type {
  FAQ,
  AboutStat,
  CommunityStat,
  ContactMethod,
  PlatformFeature,
  CommunityProfile,
  NavigationLink,
  AboutCard,
} from "./type";

export const logoImage: string = "/logo.png";
export const logoText: string = "Diaspo9ja";
export const promoImage: string = "/api/placeholder/600/400";
export const communityGridImage: string = "/api/placeholder/800/600";

export const platformFeatures: PlatformFeature[] = [
  {
    id: "news",
    title: "Latest News & Updates",
    description:
      "Stay informed with breaking news, policy updates, and insider insights specifically curated for the Nigerian diaspora community. Our editorial team ensures you never miss crucial developments.",
    icon: Newspaper,
    color: "text-primary",
    bgColor: "bg-primary/10",
    gradient: "from-primary/20 to-primary/5",
    stats: "250+ articles weekly",
    features: ["Expert analysis", "Global coverage", "Real-time updates"],
  },
  {
    id: "investment",
    title: "Investment Opportunities",
    description:
      "Discover vetted investment opportunities in Nigeria and across Africa. Connect with fellow diaspora investors and access exclusive deals with full due diligence reports.",
    icon: TrendingUp,
    color: "text-accent",
    bgColor: "bg-accent/10",
    gradient: "from-accent/20 to-accent/5",
    stats: "$50M+ deals showcased",
    features: ["Due diligence", "Investor network", "Vetted opportunities"],
  },
  {
    id: "business",
    title: "Business Directory",
    description:
      "Connect with Nigerian-owned businesses worldwide. Whether you're looking for services or want to showcase your business, our directory is your gateway to the diaspora economy.",
    icon: Briefcase,
    color: "text-primary",
    bgColor: "bg-primary/10",
    gradient: "from-primary/20 to-primary/5",
    stats: "5,000+ businesses listed",
    features: ["Verified listings", "Global directory", "Direct connections"],
  },
  {
    id: "blog",
    title: "Community Stories",
    description:
      "Read inspiring success stories, cultural insights, and personal journeys from diaspora members. Share your own story and inspire others in the community.",
    icon: BookOpen,
    color: "text-accent",
    bgColor: "bg-accent/10",
    gradient: "from-accent/20 to-accent/5",
    stats: "1,000+ stories shared",
    features: ["Success stories", "Cultural insights", "Personal journeys"],
  },
];

export const communityStats: CommunityStat[] = [
  {
    label: "Articles this week",
    value: "28",
    icon: BookOpen,
    trend: "+12%",
  },
  {
    label: "Total readers",
    value: "15.2k",
    icon: Users,
    trend: "+24%",
  },
  {
    label: "Premium subscribers",
    value: "2.1k",
    icon: Star,
    trend: "+18%",
  },
  {
    label: "Total Contributors",
    value: "47",
    icon: MessageCircle,
    trend: "+8%",
  },
];

export const aboutStats: AboutStat[] = [
  { number: "50+", label: "Countries Represented", icon: Globe },
  { number: "15,000+", label: "Active Members", icon: Users },
  { number: "5,000+", label: "Successful Connections", icon: Heart },
  { number: "98%", label: "Member Satisfaction", icon: Award },
];

export const communityProfiles: CommunityProfile[] = [
  {
    name: "Adaora K.",
    role: "Software Engineer",
    location: "Toronto, Canada",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b190?w=200&h=200&fit=crop&crop=face",
    industry: "Technology",
  },
  {
    name: "Chinedu M.",
    role: "Business Owner",
    location: "London, UK",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    industry: "Finance",
  },
  {
    name: "Kemi O.",
    role: "Medical Doctor",
    location: "Dubai, UAE",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    industry: "Healthcare",
  },
  {
    name: "Emeka A.",
    role: "Creative Director",
    location: "New York, USA",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    industry: "Design",
  },
  {
    name: "Folake S.",
    role: "Data Scientist",
    location: "Berlin, Germany",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    industry: "Technology",
  },
  {
    name: "Tunde R.",
    role: "Entrepreneur",
    location: "Lagos, Nigeria",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    industry: "Business",
  },
];

export const faqs: FAQ[] = [
  {
    question: "What is Diaspora 9ja?",
    answer:
      "Diaspora 9ja is a comprehensive digital platform connecting Nigerians worldwide. We provide trusted news, investment opportunities, business networking, mentorship programs, and cultural exchange opportunities tailored specifically for the Nigerian diaspora community.",
  },
  {
    question: "Who can join our community?",
    answer:
      "Anyone with a connection to Nigeria is welcome! Whether you're a Nigerian living abroad, a Nigerian at home looking to connect globally, or someone interested in Nigerian culture and business opportunities. Our community is inclusive and diverse.",
  },
  {
    question: "What's included in membership?",
    answer:
      "Basic membership is free and includes access to community posts, basic news updates, and public forums. Premium membership ($10/month early bird, $25/month regular) includes exclusive content, investment opportunities, priority business listings, mentorship matching, and private community groups.",
  },
  {
    question: "How do I upgrade to Premium?",
    answer:
      "You can upgrade to Premium anytime from your account dashboard. We use Stripe for secure payment processing, and you can cancel anytime. Premium members get immediate access to all exclusive features.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard encryption and security measures to protect your data. We never sell your information to third parties and are fully GDPR compliant. Your privacy and security are our top priorities.",
  },
];

export const contactMethods: ContactMethod[] = [
  {
    icon: Mail,
    title: "Email Us",
    value: "hello@diaspora9ja.com",
    description: "For general inquiries and support",
    action: "mailto:hello@diaspora9ja.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+44 20 7946 0958",
    description: "Business hours: 9 AM - 6 PM GMT",
    action: "tel:+442079460958",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    value: "Available 24/7",
    description: "Instant support for members",
    action: "#",
  },
];

export const navigationLinks: NavigationLink[] = [
  { href: "#about", label: "About" },
  { href: "#platform", label: "Platform" },
  { href: "#community", label: "Community" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faqs", label: "FAQs" },
  { href: "#contact", label: "Contact" },
];

export const aboutCards: AboutCard[] = [
  {
    id: "mission",
    title: "Our Mission",
    description:
      "To unite Nigerians worldwide through a vibrant, inclusive digital hub that fosters networking, learning, and collaboration across borders and industries.",
    icon: Target,
    color: "text-primary",
    features: [
      "Global networking",
      "Knowledge sharing",
      "Cultural preservation",
    ],
  },
  {
    id: "vision",
    title: "Our Vision",
    description:
      "A thriving global community where every Nigerian, regardless of location, feels connected, supported, and empowered to achieve extraordinary success.",
    icon: Eye,
    color: "text-accent",
    features: [
      "Mutual support",
      "Collective success",
      "Borderless connections",
    ],
  },
  {
    id: "impact",
    title: "Our Impact",
    description:
      "Since 2023, we've facilitated thousands of connections, enabled millions in investments, and created opportunities that span continents.",
    icon: Heart,
    color: "text-primary",
    features: ["50+ countries", "$50M+ in deals", "5,000+ businesses"],
  },
];
