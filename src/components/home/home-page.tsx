import PoolsTable from "@/components/table/pools/pools-table";
import { PageContainer } from "@/components/layout/page-container";
import { HeroSection } from "@/components/sections/hero/hero-section";

export const HomePage = () => {
  return (
    <PageContainer className="relative z-10">
      <HeroSection />
      <section className="relative">
        <PoolsTable />
      </section>
    </PageContainer>
  );
};
