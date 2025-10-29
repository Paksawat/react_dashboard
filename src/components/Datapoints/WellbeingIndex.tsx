import CardHeader from '@/components/Common/CardHeader';
import { RootState } from '@/stores/store';
import { TiArrowSortedDown } from 'react-icons/ti';
import { useSelector } from 'react-redux';
import { useGetWellbeingIndexQuery } from '@/api/apiSlice';
import EmptyState from '../Common/EmptyState';
import Loader from '../Common/Loader';

const WellbeingIndex = () => {
  const company = useSelector((state: RootState) => state.company.company);
  const department = useSelector(
    (state: RootState) => state.company.selectedDepartmentId
  );

  const {
    data: wellbeingData,
    isLoading,
    error,
  } = useGetWellbeingIndexQuery(
    {
      companyId: company?.id || '',
      departmentId: department || '',
    },
    { skip: !company?.id || !department }
  );

  // Debug: Log the query parameters
  console.log('Wellbeing Query Params:', {
    companyId: company?.id,
    departmentId: department,
    skip: !company?.id || !department,
  });

  // Debug: Log the API response to understand the structure
  if (wellbeingData) {
    console.log('Wellbeing API Response:', wellbeingData);
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.error('Wellbeing API Error:', error);
    return (
      <div className='flex flex-col lg:pb-14'>
        <CardHeader title={'Wellbeing index'} />
        <EmptyState survey={true} />
      </div>
    );
  }

  // Handle case where data might not have the expected structure
  // Convert decimal score to percentage (e.g., 0.0833 -> 8.33%)
  const rawScore = wellbeingData?.score ?? null;
  const indexValue = rawScore !== null ? Math.round(rawScore * 100) : null;

  return (
    <div className='flex flex-col lg:pb-14'>
      <CardHeader
        title={'Wellbeing index'}
        tooltip={
          <>
            <h4 className='mb-2 font-semibold'>The Wellbeing Index</h4>
            <p className='mb-4'>
              Comes from the World Health Organization’s “WHO-5” questionnaire,
              which is a short, self-administered measure of wellbeing. It
              consists of five positively worded items that are rated on 6-point
              Likert scale, ranging from 0 (at no time) to 5 (all of the time).
            </p>
            <p className='mb-4'>
              The raw scores are transformed to a score from 0 to 100, with
              lower scores indicating worse well-being. A score of ≤50 indicates
              poor wellbeing and suggests further investigation into possible
              symptoms of depression. A score of 28 or below is indicative of
              depression.
            </p>
          </>
        }
      />
      <div className='flex gap-4 mb-2'>
        <p className='text-title font-semibold text-sm 3xl:text-lg'>
          0 <span className='text-body font-normal'> = worst possible</span>
        </p>
        <p className='text-title font-semibold text-sm 3xl:text-lg'>
          100{' '}
          <span className='text-body font-normal text-sm 3xl:text-lg'>
            = best possible
          </span>
        </p>
      </div>
      {/*
      <LastComparison
        rising={true}
        comparing="vs last survey"
        difference={14}
      />*/}
      {indexValue === null && <EmptyState survey={true} />}
      <div className='bar relative w-auto mx-5 h-6 mt-[2.5rem] lg:mt-[3.5rem]'>
        {indexValue && (
          <div
            className='percentage absolute top-[-2.5rem] flex flex-col items-center 3xl:top-[-3rem]'
            style={{
              left: `calc(${Math.min(
                Math.max(Number(indexValue), 0),
                100
              )}% - ${
                Number(indexValue) === 0
                  ? 10
                  : Number(indexValue) === 100
                  ? 30
                  : 28
              }px)`,
            }}
          >
            <p className='text-title text-title-md font-semibold 3xl:text-title-lg'>
              {indexValue}
              <span className='text-sm text-gray-600 font-medium 3xl:text-title-sm'>
                %
              </span>
            </p>
            <TiArrowSortedDown className='needle mt-[-8px] text-2xl text-[#2D59FD]' />
          </div>
        )}
        <div className='w-full h-4 bg-[#C8D6FF] relative text-white font-semibold rounded-md leading-4 3xl:h-6'>
          <p className='ml-2 3xl:text-lg'>0</p>
          <span className='w-[50%] h-full bg-[#6890FF] block absolute right-0 top-0 rounded-r-md border-l-[1px] border-title border-dashed'></span>
          <p className='absolute right-2 top-0 3xl:text-lg'>100</p>
        </div>
        <p className='text-sm mt-1 place-self-center 3xl:text-lg'>
          Under 50% indicates poor wellbeing
        </p>
      </div>
    </div>
  );
};

export default WellbeingIndex;
