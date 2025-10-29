import ENPS from '@/components/Datapoints/ENPS';

import WellbeingIndex from '@/components/Datapoints/WellbeingIndex';

import Metrics from '@/components/Datapoints/Metrics';
import Stressors from '@/components/Datapoints/Stressors';
import LifeSatisfactory from '@/components/Datapoints/LifeSatisfactory';

const Overview: React.FC = () => {
  return (
    <div className='flex-grow h-fit'>
      <div>
        <h2 className='text-title-lg font-semibold text-title my-2 3xl:text-title-xxl'>
          Overview
        </h2>
      </div>

      <div className=' gap-4 md:grid md:grid-cols-4 mdCustomStart:grid-cols-8 xl:grid-cols-8 md:gap-4 2xl:gap-6 w-full flex-grow 3xl:h-full 3xl:grid-rows-[auto_auto_auto]'>
        {/* Summary Start */}
        {/*  <div className=' text-white flex flex-col rounded-xl shadow-default  mb-4 md:mb-0 lg:col-span-1 xl:col-span-2'>
          <Summary />
        </div> */}
        {/* Metrics Start */}
        <div className='flex flex-col gap-4 mb-4 sm:flex-row md:mb-0 flex-basis-0 md:col-span-3 lg:col-span-3 xl:col-span-6'>
          <Metrics />
        </div>
        {/* Stressors Start */}
        <div className=' h-full rounded-xl shadow-default bg-white p-4 relative  mb-4 md:col-span-4 xl:col-start-1 xl:col-span-5'>
          <div>
            <Stressors />
          </div>
        </div>

        {/* Metric chart Start 
        <div className="  rounded-xl shadow-default bg-white p-4 relative md:col-span-4 h-fit mb-4 lg:col-span-4 xl:col-span-5">
          <MetricsChart />
        </div>
        */}

        {/* Wellbeing index Start */}
        <div className='rounded-xl shadow-default bg-white p-4 relative  mb-4 md:mb-0 pb-12 md:pb-0 md:col-span-4 lg:col-span-4 xl:col-span-3 xl:col-start-6 xl:row-start-2'>
          <WellbeingIndex />
        </div>

        {/* Employee NPS index Start */}
        <div className='h-full rounded-xl shadow-default bg-white p-4 relative  mb-4 md:col-span-4 xl:col-start-1 xl:col-span-5'>
          <ENPS />
        </div>

        <div className='rounded-xl shadow-default bg-white p-4 relative  mb-4 md:mb-0 pb-12 md:pb-0 md:col-span-4 xl:col-span-3'>
          <LifeSatisfactory />
        </div>
      </div>
    </div>
  );
};

export default Overview;
