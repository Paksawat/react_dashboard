import ENPS from '@/components/Datapoints/ENPS';

import WellbeingIndex from '@/components/Datapoints/WellbeingIndex';

import Metrics from '@/components/Datapoints/Metrics';
import HealthContributors from '@/components/Datapoints/HealthContributors';
import LifeSatisfactory from '@/components/Datapoints/LifeSatisfactory';

const Overview: React.FC = () => {
  return (
    <div className="flex-grow h-full">
      <div>
        <h2 className="text-title-lg font-semibold text-title my-2 ">
          Overview
        </h2>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <Metrics />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <HealthContributors />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <ENPS />
        </div>

        <div className="col-span-12 xl:col-span-4">
          <WellbeingIndex />
        </div>

        <div className="col-span-12 xl:col-span-4">
          <LifeSatisfactory />
        </div>
      </div>
    </div>
  );
};

export default Overview;
