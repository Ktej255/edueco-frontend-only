"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

// Icons as components
const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const MessageIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const BroadcastIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
);

const TemplateIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
);

const AutomationIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const FormIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ChatIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    </svg>
);

const BotIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const AnalyticsIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const MetaPartnerIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12" />
    </svg>
);

const ArrowRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

// Animated counter component
const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count}{suffix}</span>;
};

// Stats data
const stats = [
    { value: 98, suffix: "%", label: "Open Rate" },
    { value: 45, suffix: "%", label: "Response Rate" },
    { value: 3, suffix: "x", label: "Faster Conversions" },
    { value: 100, suffix: "K+", label: "Messages Sent Daily" },
];

// Features data
const features = [
    {
        icon: BroadcastIcon,
        title: "Broadcast Campaigns with Confidence",
        description: "Reach the right students at scale with program launches, scholarship updates, event invites, and webinar promotions, all sent directly from Meritto CRM.",
        benefits: [
            "Add CTAs and quick reply buttons to boost responses",
            "Automatically capture replies as leads in CRM",
            "Personalize messages with dynamic variables",
        ],
        gradient: "from-green-500 to-emerald-600",
    },
    {
        icon: TemplateIcon,
        title: "Manage Custom Templates",
        description: "Manage interactive templates for your most-used WhatsApp messages from welcomes to application updates, ready for quick use and personalization.",
        benefits: [
            "Organize templates under marketing, utility, or service",
            "Monitor Meta approvals and quality ratings",
            "Categorize, customize, and send in seconds",
        ],
        gradient: "from-blue-500 to-indigo-600",
    },
    {
        icon: AutomationIcon,
        title: "Smart Automation Journeys",
        description: "Keep students on track with stage-based WhatsApp communication. Let their engagement trigger the next best actions automatically.",
        benefits: [
            "Automated reminders for deadlines and payments",
            "Stage-based trigger workflows",
            "Personalized journeys that reduce drop-offs",
        ],
        gradient: "from-purple-500 to-violet-600",
    },
    {
        icon: FormIcon,
        title: "In-Chat Customizable Forms",
        description: "Build interactive forms that open directly inside WhatsApp chat, making it simple for students to share details without leaving the app.",
        benefits: [
            "Collect feedback and surveys seamlessly",
            "Auto-sync details into CRM",
            "Smoother and more engaging experience",
        ],
        gradient: "from-orange-500 to-red-500",
    },
    {
        icon: ChatIcon,
        title: "Live Chat Platform - Echo",
        description: "Reply naturally beyond static templates while keeping every exchange tracked. From first inquiry to final admit, every chat is contextually nurtured.",
        benefits: [
            "Manage all WhatsApp replies from one inbox",
            "Filter and track chats as queued or resolved",
            "Contextual conversation history",
        ],
        gradient: "from-pink-500 to-rose-600",
    },
    {
        icon: BotIcon,
        title: "Niaa - AI Education Chatbot",
        description: "Never leave a student waiting. Automated responses handle FAQs, share details, and keep conversations active even outside working hours.",
        benefits: [
            "24/7 instant engagement",
            "Automate FAQs and repetitive queries",
            "Free up counselor bandwidth",
        ],
        gradient: "from-cyan-500 to-teal-600",
    },
];

// Comparison data
const comparisonData = [
    {
        aspect: "Lead Data & Context",
        withMeritto: "Conversations auto-linked to CRM leads & applications",
        icon: "🔗",
    },
    {
        aspect: "Personalization & Automation",
        withMeritto: "CRM fields + AI drive contextual campaigns & follow-ups",
        icon: "🤖",
    },
    {
        aspect: "Engagement Visibility",
        withMeritto: "Unified timeline across WhatsApp, calls, emails & applications",
        icon: "👁️",
    },
    {
        aspect: "Insights & ROI",
        withMeritto: "End-to-end funnel tracking + AI shows what drives conversions",
        icon: "📊",
    },
    {
        aspect: "Compliance & Scale",
        withMeritto: "Secure, role-based access with team routing built in",
        icon: "🔒",
    },
];

// Partner benefits
const partnerBenefits = [
    {
        title: "Faster Onboarding",
        description: "Get started directly through Meritto CRM and secure your green tick quickly.",
    },
    {
        title: "Multi-Number Management",
        description: "Manage multiple numbers with ease, set default replies, opt-ins, and opt-outs.",
    },
    {
        title: "Early Access",
        description: "Unlock Meta benefits and early access to new WhatsApp features.",
    },
];

export default function WhatsAppBusinessPage() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-3xl" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                            <WhatsAppIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Meritto
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
                        <a href="#benefits" className="text-gray-400 hover:text-white transition-colors">Benefits</a>
                        <a href="#comparison" className="text-gray-400 hover:text-white transition-colors">Why Meritto</a>
                    </div>
                    <Link
                        href="/dashboard"
                        className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all hover:scale-105"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <motion.section
                style={{ opacity, scale }}
                className="relative z-10 px-6 pt-16 pb-24"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Official Meta Tech Partner
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                        >
                            Power Higher{" "}
                            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                Enrollments
                            </span>
                            <br />
                            with WhatsApp Business API
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
                        >
                            Scale your student reach, reduce drop-offs, and convert faster with WhatsApp campaigns
                            and conversations, seamlessly powered by Meritto CRM.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                        >
                            <Link
                                href="/dashboard"
                                className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-semibold text-lg flex items-center gap-2 hover:shadow-2xl hover:shadow-green-500/30 transition-all hover:scale-105"
                            >
                                Start Free Trial
                                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
                                <MessageIcon className="w-5 h-5" />
                                Watch Demo
                            </button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
                        >
                            {stats.map((stat, index) => (
                                <div key={index} className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Hero Image/Phone Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-20 relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                        <div className="relative mx-auto max-w-4xl">
                            {/* Phone Mockup */}
                            <div className="relative w-72 h-[500px] mx-auto">
                                {/* Phone Frame */}
                                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-gray-800 to-gray-900 p-2 shadow-2xl">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl z-20" />
                                    <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-b from-green-600/20 to-slate-900 overflow-hidden">
                                        {/* Chat Interface */}
                                        <div className="p-4 pt-10">
                                            {/* Chat Header */}
                                            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                                    <span className="text-sm font-bold">M</span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm">Meritto Education</div>
                                                    <div className="text-xs text-green-400 flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                                        Online
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Messages */}
                                            <div className="space-y-3">
                                                <div className="bg-green-600/90 rounded-2xl rounded-bl-md p-3 max-w-[85%] ml-auto">
                                                    <p className="text-sm">Hi! I'm interested in the MBA program 🎓</p>
                                                    <span className="text-[10px] text-white/70 float-right mt-1">10:30 AM</span>
                                                </div>
                                                <div className="bg-white/10 rounded-2xl rounded-br-md p-3 max-w-[85%]">
                                                    <p className="text-sm">Welcome! We'd love to help you explore our MBA program. 📚</p>
                                                    <span className="text-[10px] text-white/50 float-right mt-1">10:31 AM</span>
                                                </div>
                                                <div className="bg-white/10 rounded-2xl rounded-br-md p-3 max-w-[85%]">
                                                    <p className="text-sm">Here's a quick form to get started:</p>
                                                    <div className="mt-2 p-2 bg-white/10 rounded-xl">
                                                        <div className="text-xs font-semibold text-green-400">📝 Apply Now</div>
                                                        <div className="text-[10px] text-gray-400">Tap to fill application</div>
                                                    </div>
                                                    <span className="text-[10px] text-white/50 float-right mt-1">10:31 AM</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Glow Effect */}
                                <div className="absolute -inset-4 bg-green-500/20 blur-3xl rounded-full -z-10" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* How It Works Section */}
            <section className="relative z-10 px-6 py-24 bg-gradient-to-b from-slate-900/50 to-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold mb-4"
                        >
                            How WhatsApp Business API{" "}
                            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                Boosts Enrollments
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-400 max-w-3xl mx-auto"
                        >
                            With 98% open rates, rich-media messaging, and broadcast capabilities,
                            WhatsApp Business API connects you with students instantly and personally.
                        </motion.p>
                    </div>

                    {/* Feature Cards */}
                    <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-500/30 transition-all duration-300 hover:bg-white/10"
                            >
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>

                                {/* Title & Description */}
                                <h3 className="text-xl font-bold mb-3 group-hover:text-green-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Benefits */}
                                <ul className="space-y-2">
                                    {feature.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                            <CheckIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Hover Gradient */}
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Analytics Section */}
            <section id="benefits" className="relative z-10 px-6 py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
                                <AnalyticsIcon className="w-4 h-4" />
                                Powerful Analytics
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Track & Measure{" "}
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    ROI
                                </span>
                                {" "}from Every Conversation
                            </h2>
                            <p className="text-lg text-gray-400 mb-8">
                                Move beyond vanity metrics. See how every WhatsApp campaign contributes to applications
                                and enrollments. With Meritto CRM as the backbone, you can tie conversations directly
                                to outcomes and know exactly what's driving results.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                        <CheckIcon className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <span className="text-gray-300">Track movement from inquiry to enrollment with clear funnel visibility</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                        <CheckIcon className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <span className="text-gray-300">Use ROI insights to double down on what truly works</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                        <CheckIcon className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <span className="text-gray-300">Measure campaign effectiveness with real-time analytics</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Analytics Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                                {/* Mini Dashboard */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20">
                                        <div className="text-xs text-gray-400 mb-1">Messages Sent</div>
                                        <div className="text-2xl font-bold text-green-400">12,847</div>
                                        <div className="text-xs text-green-500 mt-1">↑ 24% vs last week</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20">
                                        <div className="text-xs text-gray-400 mb-1">Conversions</div>
                                        <div className="text-2xl font-bold text-purple-400">2,463</div>
                                        <div className="text-xs text-purple-500 mt-1">↑ 18% vs last week</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20">
                                        <div className="text-xs text-gray-400 mb-1">Open Rate</div>
                                        <div className="text-2xl font-bold text-blue-400">98.2%</div>
                                        <div className="text-xs text-blue-500 mt-1">Industry leading</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20">
                                        <div className="text-xs text-gray-400 mb-1">Response Time</div>
                                        <div className="text-2xl font-bold text-orange-400">2.3s</div>
                                        <div className="text-xs text-orange-500 mt-1">Avg with automation</div>
                                    </div>
                                </div>

                                {/* Simple Chart */}
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium">Enrollment Funnel</span>
                                        <span className="text-xs text-gray-400">Last 30 days</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs w-20 text-gray-400">Inquiries</span>
                                            <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                                                <div className="h-full w-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                                            </div>
                                            <span className="text-xs text-gray-300">12,847</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs w-20 text-gray-400">Engaged</span>
                                            <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                                                <div className="h-full w-[75%] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                                            </div>
                                            <span className="text-xs text-gray-300">9,635</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs w-20 text-gray-400">Applied</span>
                                            <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                                                <div className="h-full w-[45%] bg-gradient-to-r from-purple-500 to-violet-500 rounded-full" />
                                            </div>
                                            <span className="text-xs text-gray-300">5,782</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs w-20 text-gray-400">Enrolled</span>
                                            <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                                                <div className="h-full w-[20%] bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                                            </div>
                                            <span className="text-xs text-gray-300">2,463</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Glow */}
                            <div className="absolute -inset-4 bg-purple-500/10 blur-3xl rounded-full -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Comparison Table Section */}
            <section id="comparison" className="relative z-10 px-6 py-24 bg-gradient-to-b from-slate-950 to-slate-900">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold mb-4"
                        >
                            The{" "}
                            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                Meritto Difference
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-400"
                        >
                            WhatsApp Business API for educational organizations
                        </motion.p>
                    </div>

                    {/* Comparison Cards */}
                    <div className="space-y-4">
                        {comparisonData.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-500/30 transition-all flex items-center gap-4"
                            >
                                <div className="text-3xl">{item.icon}</div>
                                <div className="flex-1">
                                    <div className="font-semibold text-white mb-1">{item.aspect}</div>
                                    <div className="text-gray-400 text-sm">{item.withMeritto}</div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CheckIcon className="w-6 h-6 text-green-400" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meta Partner Section */}
            <section className="relative z-10 px-6 py-24">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20 border border-green-500/20 overflow-hidden"
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "24px 24px" }} />
                        </div>

                        <div className="relative z-10 text-center">
                            {/* Meta Partner Badge */}
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-medium mb-8">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C9.447 0 7.123.852 6.261 2.553 5.538 3.988 5.5 5.69 5.5 7.5c0 .953-.037 1.93-.037 2.906 0 1.12-.25 1.55-.625 2.125-.376.574-.375 1.01-.375 1.969s.007 1.5.5 2.25.75.75 1.562 1.125c.584.27 1.25.438 1.75.625.5.188 1.125.5 1.688 1.063.562.561 1.062 1.312 1.062 2.437 0 1.125-.5 1.875-1.063 2.438-.562.562-1.187.874-1.687 1.062-.5.187-1.166.355-1.75.625-.812.375-1.07.375-1.562 1.125s-.5 1.29-.5 2.25-.001 1.395.375 1.969c.375.574.625 1.005.625 2.125 0 .977.037 1.953.037 2.906 0 1.81.038 3.512.761 4.947C7.123 23.148 9.447 24 12 24s4.877-.852 5.739-2.553c.723-1.435.761-3.137.761-4.947 0-.953.037-1.929.037-2.906 0-1.12.25-1.551.625-2.125.376-.574.375-1.01.375-1.969s-.007-1.5-.5-2.25-.75-.75-1.562-1.125a10.477 10.477 0 01-1.75-.625c-.5-.188-1.125-.5-1.688-1.063-.562-.562-1.062-1.312-1.062-2.437 0-1.125.5-1.876 1.063-2.438.562-.562 1.187-.875 1.687-1.062.5-.188 1.166-.356 1.75-.625.812-.375 1.07-.375 1.562-1.125s.5-1.291.5-2.25.001-1.395-.375-1.969c-.375-.574-.625-1.006-.625-2.125 0-.977-.037-1.953-.037-2.906 0-1.81-.038-3.512-.761-4.947C16.877.852 14.553 0 12 0z" />
                                </svg>
                                Official Meta Tech Partner
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Getting Started is Quick and Easy
                            </h2>
                            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
                                As an official Meta Tech Partner, Meritto provides faster onboarding,
                                secure green tick verification, and early access to new WhatsApp features.
                            </p>

                            {/* Partner Benefits */}
                            <div className="grid md:grid-cols-3 gap-6 mb-12">
                                {partnerBenefits.map((benefit, index) => (
                                    <div key={index} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 mx-auto">
                                            <CheckIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold mb-2">{benefit.title}</h3>
                                        <p className="text-sm text-gray-400">{benefit.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-green-500/30 transition-all hover:scale-105"
                            >
                                Get Started Now
                                <ArrowRightIcon className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <WhatsAppIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-lg">Meritto CRM</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                    <div className="text-sm text-gray-500">
                        © 2024 Meritto. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
