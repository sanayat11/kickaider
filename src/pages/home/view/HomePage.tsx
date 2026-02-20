import type { FC } from 'react';
import { HeroBlock } from '@/widgets/heroBlock';
import { FeaturesBlock } from '@/widgets/featuresBlock';
import { TeamBlock } from '@/widgets/teamBlock';
import { SliderBlock } from '@/widgets/sliderBlock';
import { FaqBlock } from '@/widgets/faqBlock';

export const HomePage: FC = () => {
  return (
    <>
      <HeroBlock />
      <FeaturesBlock />
      <TeamBlock />
      <SliderBlock />
      <FaqBlock />
      <h1>HOME</h1>
    </>
  );
};
