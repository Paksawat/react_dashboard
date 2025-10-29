import CardHeader from '@/components/Common/CardHeader';
import { RootState } from '@/stores/store';
import { TiArrowSortedDown } from 'react-icons/ti';
import { useSelector } from 'react-redux';
import { useGetLifeSatisfactionQuery } from '@/api/apiSlice';
import EmptyState from '../Common/EmptyState';
import Loader from '../Common/Loader';

const steps = [
  'Hopeless',
  'Depressed',
  'Suffering',
  'Struggling',
  'Coping',
  'Just okay',
  'Doing well',
  'Blooming',
  'Thriving',
  'Prospering',
];

const LifeSatisfactory = () => {
  const company = useSelector((state: RootState) => state.company.company);
  const department = useSelector(
    (state: RootState) => state.company.selectedDepartmentId
  );

  const {
    data: lifeSatisfactionData,
    isLoading,
    error,
  } = useGetLifeSatisfactionQuery(
    {
      companyId: company?.id || '',
      departmentId: department || '',
    },
    { skip: !company?.id || !department }
  );

  const indexValue = lifeSatisfactionData?.score ?? null;
  const step =
    indexValue !== null ? steps[Math.min(Math.floor(indexValue), 9)] : null;

  const calculateNeedleLeft = (score: number) => {
    if (score < 4) {
      return (score / 4) * 33;
    } else if (score < 7) {
      return ((score - 4) / 3) * 33 + 33;
    } else {
      return ((score - 6.9) / 3) * 30 + 64;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className='flex flex-col lg:pb-14'>
        <CardHeader title={'Average Life Satisfactory'} />
        <EmptyState survey={true} />
      </div>
    );
  }

  return (
    <div className='flex flex-col lg:pb-14'>
      <CardHeader
        title={'Average Life Satisfactory'}
        tooltip={
          <>
            <h4 className='mb-2 font-semibold'>Average Life Satisfactory</h4>
            <p className='mb-4'>
              This score represents how individuals rate their current life on a
              scale from 0 to 10, based on the{' '}
              <strong>Cantril Self-Anchoring Ladder</strong>, a widely used
              measure of wellbeing.
            </p>
            <p className='mb-4'>
              Participants imagine a ladder with steps numbered from 0 (the
              worst possible life) to 10 (the best possible life), and indicate
              which step they feel they are currently on.
            </p>
            <p className='mb-4'>
              Each step reflects a general life satisfaction category:
            </p>
            <p className='mb-4'>
              <strong>0–&lt;1:</strong> Hopeless
              <br />
              <strong>1–&lt;2:</strong> Depressed
              <br />
              <strong>2–&lt;3:</strong> Suffering
              <br />
              <strong>3–&lt;4:</strong> Struggling
              <br />
              <strong>4–&lt;5:</strong> Coping
              <br />
              <strong>5–&lt;6:</strong> Just Okay
              <br />
              <strong>6–&lt;7:</strong> Doing Well
              <br />
              <strong>7–&lt;8:</strong> Blooming
              <br />
              <strong>8–&lt;9:</strong> Thriving
              <br />
              <strong>9–10:</strong> Prospering
            </p>
            <p className='mb-4'>
              A higher average score suggests better overall wellbeing and life
              satisfaction across your team or organization.
            </p>
          </>
        }
      />
      <div className='flex gap-4 mb-2'>
        <p className='text-title font-semibold text-sm 3xl:text-lg'>
          0 <span className='text-body font-normal'> = worst possible</span>
        </p>
        <p className='text-title font-semibold text-sm 3xl:text-lg'>
          10{' '}
          <span className='text-body font-normal text-sm 3xl:text-lg'>
            = best possible
          </span>
        </p>
      </div>
      {indexValue !== null}
      <div className='bar relative w-full h-6 mt-[2.5rem] lg:mt-[3.5rem] pr-4'>
        {indexValue !== null && (
          <div
            className='absolute -top-14 z-10 flex flex-col items-center pointer-events-none'
            style={{
              left: `${calculateNeedleLeft(indexValue)}%`,
              transform: 'translateX(-40%)',
            }}
          >
            <div className='text-center leading-none'>
              <p className='text-title text-title-md font-semibold 3xl:text-title-lg'>
                {indexValue.toFixed(1)}
              </p>
              {step && (
                <span className='text-sm text-gray-600 font-medium 3xl:text-title-sm leading-none'>
                  ({step})
                </span>
              )}
            </div>
            <TiArrowSortedDown className='needle text-2xl text-[#2D59FD] leading-none' />
          </div>
        )}
        {indexValue !== null && (
          <div className='w-full grid grid-cols-[33%_33%_33%] 2xl:grid-cols-[33%_33%_33%] gap-1 mt-2 font-semibold 3xl:mt-12'>
            <div className=' relative text-white leading-4 w-full flex flex-col 3xl:text-lg'>
              <span className=' rounded-sm px-1 bg-[#9CAEFF] w-full'>0</span>
              <span className='text-gray-800 text-[12px] leading-4 text-center font-medium 3xl:text-lg'>
                Suffering area
              </span>
            </div>
            <div className=' relative text-white leading-4 w-full flex flex-col 3xl:text-lg'>
              <span className='right-2 rounded-sm px-1 bg-[#6890FF] w-full'>
                4
              </span>
              <span className='text-gray-800 text-[12px] leading-4 text-center font-medium 3xl:text-lg'>
                Struggling area
              </span>
            </div>
            <div className=' relative text-white leading-4 w-full flex flex-col 3xl:text-lg'>
              <span className='absolute ml-1 3xl:text-lg'>7 </span>
              <span className='right-2 rounded-sm text-right px-1 bg-[#2D59FD] w-full'>
                10
              </span>
              <span className='text-gray-800 text-[12px] leading-4 text-center font-medium 3xl:text-lg'>
                Thriving area
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LifeSatisfactory;
