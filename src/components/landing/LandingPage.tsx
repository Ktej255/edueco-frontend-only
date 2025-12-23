"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    Brain,
    ShieldCheck,
    Users,
    ArrowRight,
    Zap,
    Globe,
    Lock,
    Target
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PortalCard = ({ title, description, icon: Icon, href, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="relative group h-full"
    >
        <Link href={href}>
            <div className="h-full bg-neutral-dark/40 backdrop-blur-xl border border-neutral-cool/30 p-8 rounded-3xl transition-all duration-300 group-hover:border-primary-blue/50 group-hover:shadow-[0_0_30px_rgba(38,103,255,0.15)]">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-blue transition-colors">
                    {title}
                </h3>
                <p className="text-neutral-slate leading-relaxed mb-6">
                    {description}
                </p>
                <div className="flex items-center text-primary-blue font-semibold group-hover:translate-x-1 transition-transform">
                    Enter Portal <ArrowRight className="ml-2 w-4 h-4" />
                </div>
            </div>
        </Link>
    </motion.div>
);

const FeatureItem = ({ icon: Icon, title, description }: any) => (
    <div className="flex gap-4 p-4 rounded-2xl hover:bg-neutral-cool/20 transition-colors">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-blue" />
        </div>
        <div>
            <h4 className="text-white font-bold mb-1">{title}</h4>
            <p className="text-neutral-slate text-sm leading-relaxed">{description}</p>
        </div>
    </div>
);

export default function LandingPage() {
    const router = useRouter();

    const handleStart = () => {
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-dark text-white selection:bg-primary-blue/30 overflow-x-hidden">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-blue/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-indigo/30 rounded-full blur-[120px]" />
            </div>

            {/* Hero Section */}
            <header className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto">
                <nav className="absolute top-8 left-6 right-6 flex justify-between items-center">
                    <div className="text-3xl font-black bg-gradient-to-r from-primary-blue to-accent-green bg-clip-text text-transparent">
                        Eduecosystem
                    </div>
                    <button
                        onClick={() => router.push("/login")}
                        className="px-6 py-2 rounded-full border border-neutral-cool/30 hover:bg-white/5 transition-all font-semibold"
                    >
                        Login
                    </button>
                </nav>

                <div className="text-center mt-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-blue/10 border border-primary-blue/20 text-primary-blue text-sm font-bold mb-8"
                    >
                        <Zap className="w-4 h-4 fill-primary-blue" />
                        Empowering the Future of Education
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black mb-6 tracking-tight"
                    >
                        The Holistic <br />
                        <span className="text-primary-blue">Learning Ecosystem</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-neutral-slate max-w-3xl mx-auto leading-relaxed mb-10"
                    >
                        A unified platform for students, teachers, and organizations.
                        Integrating Vedic wisdom, modern pedagogy, and AI-driven growth.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <button
                            onClick={handleStart}
                            className="px-10 py-5 bg-primary-blue hover:bg-blue-600 rounded-2xl text-lg font-bold shadow-[0_10px_40px_rgba(38,103,255,0.3)] transition-all flex items-center group"
                        >
                            Get Started <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-10 py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-lg font-bold border border-white/10 transition-all backdrop-blur-md">
                            Watch Demo
                        </button>
                    </motion.div>
                </div>
            </header>

            {/* Portals Grid */}
            <section className="relative py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <PortalCard
                        title="Student Portal"
                        description="Access your courses, Vedic Knowledge Graph, and meditation tools."
                        icon={BookOpen}
                        href="/student/dashboard"
                        color="bg-primary-blue"
                        delay={0.1}
                    />
                    <PortalCard
                        title="Teacher Portal"
                        description="Manage batches, create content, and track student growth."
                        icon={Users}
                        href="/teacher/dashboard"
                        color="bg-accent-green"
                        delay={0.2}
                    />
                    <PortalCard
                        title="Admin CRM"
                        description="Full system control, lead management, and advanced analytics."
                        icon={ShieldCheck}
                        href="/admin/dashboard"
                        color="bg-accent-coral"
                        delay={0.3}
                    />
                    <PortalCard
                        title="Enterprise SSO"
                        description="Scalable authentication solutions for schools and corporate partners."
                        icon={Lock}
                        href="/auth/sso"
                        color="bg-primary-indigo"
                        delay={0.4}
                    />
                </div>
            </section>

            {/* Feature Section */}
            <section className="relative py-24 px-6 bg-gradient-to-b from-transparent to-neutral-cool/5 mt-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                            One Unified <br />Technology Stack
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FeatureItem
                                icon={Brain}
                                title="AI Growth Engine"
                                description="Personalized learning paths driven by advanced AI agents."
                            />
                            <FeatureItem
                                icon={Globe}
                                title="Global Scalability"
                                description="Built on AWS for 99.9% uptime and lightning fast speeds."
                            />
                            <FeatureItem
                                icon={Target}
                                title="Precision Analytics"
                                description="Track holistic progress including cognitive and spiritual growth."
                            />
                            <FeatureItem
                                icon={Zap}
                                title="Instant Access"
                                description="Optimized SSR for immediate page loads across all devices."
                            />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/20 to-accent-coral/20 flex items-center justify-center">
                            <div className="text-primary-blue/50 text-2xl font-bold italic">Dashboard Preview</div>
                        </div>
                        {/* Visual element here */}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-neutral-cool/20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-2xl font-black opacity-50">Eduecosystem</div>
                    <div className="flex gap-8 text-neutral-slate text-sm">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Contact Support</Link>
                    </div>
                    <div className="text-neutral-slate text-sm">
                        © 2025 Eduecosystem. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
