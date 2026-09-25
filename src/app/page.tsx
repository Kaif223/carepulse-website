import type { Metadata } from 'next';

import { Hero } from '@/components/hero/Hero';
import { SiteFooter } from '@/components/navigation/SiteFooter';
import { SiteHeader } from '@/components/navigation/SiteHeader';
import { AudienceSection } from '@/components/sections/AudienceSection';
import { BranchesSection } from '@/components/sections/BranchesSection';
import { CustomersSection } from '@/components/sections/CustomersSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { FinalCta } from '@/components/sections/FinalCta';
import { FinanceSection } from '@/components/sections/FinanceSection';
import { InventorySection } from '@/components/sections/InventorySection';
import { ModulesSection } from '@/components/sections/ModulesSection';
import { PlatformIntro } from '@/components/sections/PlatformIntro';
import { PosSection } from '@/components/sections/PosSection';
import { PurchasingSection } from '@/components/sections/PurchasingSection';
import { ReportsSection } from '@/components/sections/ReportsSection';
import { SecuritySection } from '@/components/sections/SecuritySection';
import { SystemSection } from '@/components/sections/SystemSection';
import { baseOpenGraph } from '@/lib/metadata';
import { structuredData } from '@/lib/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { ...baseOpenGraph, url: '/' },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, build-time JSON generated from our own data — no user input reaches it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()).replace(/</g, '\\u003c') }}
      />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <div id="top" />
        <Hero />
        <PlatformIntro />
        <SystemSection />
        <PosSection />
        <InventorySection />
        <PurchasingSection />
        <CustomersSection />
        <FinanceSection />
        <ReportsSection />
        <BranchesSection />
        <SecuritySection />
        <AudienceSection />
        <ModulesSection />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
