import type { FC } from 'react';
import { HeroBlock } from '@/widgets/heroBlock';
import { FeaturesBlock } from '@/widgets/featuresBlock';
import { TeamBlock } from '@/widgets/teamBlock';
import { SliderBlock } from '@/widgets/sliderBlock';
import { FaqBlock } from '@/widgets/faqBlock';
import { AboutSection } from '@/widgets/AboutSection';
import { BoostBlock } from '@/widgets/BoostBlock';
import { MemberBlock } from '@/widgets/MemberBLock';
import { SubHeader } from '@/features/SubHeader';
import { ScrollToTop } from '@/shared/ui/scrollToTop';
export const HomePage: FC = () => {
  return (
    <>
      <HeroBlock />
      <AboutSection/>
      <FeaturesBlock />
      <SubHeader/>
      <TeamBlock />
      <BoostBlock/>
      <SliderBlock />
      <MemberBlock/>
      <FaqBlock />
      <ScrollToTop />
    </>
  );
};
