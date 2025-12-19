'use client';

import React from 'react';
import './saritclasses.css';
import CollexoNavbar from '@/components/collexo/collexo-navbar';
import HeroSection from '@/components/collexo/hero-section';
import ProductsSection from '@/components/collexo/products-section';
import CollexoCentralSection from '@/components/collexo/collexo-central-section';
import SecuritySection from '@/components/collexo/security-section';
import StakeholdersSection from '@/components/collexo/stakeholders-section';
import WhyChooseSection from '@/components/collexo/why-choose-section';
import FeaturesSection from '@/components/collexo/features-section';
import CollexoFooter from '@/components/collexo/collexo-footer';

export default function SaritClassesCRMLandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <CollexoNavbar />
            <main>
                <HeroSection />
                <ProductsSection />
                <CollexoCentralSection />
                <SecuritySection />
                <StakeholdersSection />
                <WhyChooseSection />
                <FeaturesSection />
            </main>
            <CollexoFooter />
        </div>
    );
}
