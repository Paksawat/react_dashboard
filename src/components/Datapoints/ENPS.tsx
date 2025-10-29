import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Pie, PieChart } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import { useGetENPSQuery } from '@/api/apiSlice';
import CardHeader from '../Common/CardHeader';
import EmptyState from '../Common/EmptyState';
import Loader from '../Common/Loader';
type DataItem = {
  label: string;
  value: number;
};

type ColorItem = {
  fill: string;
};

type MergedItem = DataItem & ColorItem;

function mergeDataWithColors(
  data: DataItem[],
  colors: ColorItem[],
  totalResponses: number
): MergedItem[] {
  return data.map((item, index) => ({
    ...item,
    value: item.value / totalResponses, // Keep original values for pie chart
    ...colors[index],
  }));
}

const colorFill: ColorItem[] = [
  { fill: '#72CA7A' },
  { fill: '#FCE483' },
  { fill: '#EE7777' },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  Promoters: {
    label: 'Promoters',
  },
  Passive: {
    label: 'Passive',
  },
  Detractors: {
    label: 'Detractors',
  },
} satisfies ChartConfig;

const ENPS = () => {
  const company = useSelector((state: RootState) => state.company.company);
  const department = useSelector(
    (state: RootState) => state.company.selectedDepartmentId
  );

  const {
    data: enpsData,
    isLoading,
    error,
  } = useGetENPSQuery(
    {
      companyId: company?.id || '',
      departmentId: department || '',
    },
    { skip: !company?.id || !department }
  );

  const currentNPS = enpsData?.score ? Math.round(enpsData.score) : null;

  // Use real data from the API for the pie chart
  const totalResponses = enpsData
    ? enpsData.promoters + enpsData.passives + enpsData.detractors
    : 0;
  const employerNPS =
    enpsData && totalResponses > 0
      ? [
          { label: 'Promoters', value: enpsData.promoters },
          { label: 'Passive', value: enpsData.passives },
          { label: 'Detractors', value: enpsData.detractors },
        ]
      : [];

  // Merge data with colors
  const result = mergeDataWithColors(employerNPS, colorFill, totalResponses);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className='flex flex-col mt-2 lg:mb-10 gap-4'>
        <CardHeader title={'Employee NPS'} />
        <EmptyState survey={true} />
      </div>
    );
  }

  return (
    <div className='flex flex-col mt-2 lg:mb-10 gap-4'>
      <CardHeader
        title={'Employee NPS'}
        tooltip={
          <>
            <h4 className='mb-2 font-semibold'>
              The eNPS is an employee experience metric
            </h4>
            <p className='mb-4'>
              Its calculated score ranges between -100 and 100 to determine the
              group of ambassadors in your organization and how loyal your
              employees are. The employee is offered an 11-point scale from 0 to
              10, with 0 being not at all likely to 10 extremely likely.
            </p>
            <p className='mb-4'>
              Employee responses are grouped into three categories as follows:
              <ul className='ml-4'>
                <li>1. Ratings between 0 and 6 are considered detractors.</li>
                <li>2. Ratings between 7 and 8 are considered passives.</li>
                <li>3. Ratings between 9 and 10 are considered promoters</li>
              </ul>
            </p>
            <p className='mb-4'>
              Promoters are extremely loyal employees who are more likely to
              spread positive word of mouth about your organization. Passives
              are neutral; these employees are neither emotionally invested nor
              disengaged. Detractors are more likely to spread negative word of
              mouth about your organization and appear disengaged and
              dissatisfied.
            </p>
            <p className='mb-4'>
              The eNPS is calculated like this: ((Number of employee promoters –
              Number of employee detractors) / Total responses) x 100.
            </p>
          </>
        }
      />
      <div className='flex items-center flex-col xl:flex-row xl:col-[250px_auto]'>
        <div className='flex flex-col items-center 2xl:w-2/5 3xl:mt-12'>
          {currentNPS !== null ? (
            <>
              <h2 className='font-semibold text-title text-title-lg 2xl:text-title-xl 3xl:text-title-xxl'>
                {Math.round(currentNPS)}
              </h2>
              <span className='3xl:text-xl'>Current score</span>
            </>
          ) : (
            <div className='py-10'>
              <EmptyState survey={true} />
            </div>
          )}

          {/* <LastComparison
            rising={true}
            difference={14}
            comparing="vs last survey"
          />*/}
        </div>
        <div className='flex flex-col items-center sm:flex-row lg:flex-col xl:flex-row'>
          {currentNPS !== null && result.length > 0 ? (
            <>
              <ChartContainer
                config={chartConfig}
                className='mx-auto aspect-square max-h-[250px] min-h-[150px]'
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={result}
                    dataKey='value'
                    nameKey='label'
                    innerRadius={30}
                  />
                </PieChart>
              </ChartContainer>
              <div className='flex gap-2 sm:flex-col lg:flex-row xl:flex-col'>
                {result.map((item) => (
                  <div key={item.label} className='flex gap-2 flex-wrap'>
                    <span
                      className={`w-4 h-4 block rounded-lg`}
                      style={{ backgroundColor: item.fill }}
                    ></span>
                    <span className='font-semibold text-center text-title min-w-8'>
                      {totalResponses > 0 ? Math.round(item.value * 100) : 0}%
                    </span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </>
          ) : currentNPS !== null ? (
            <div className='py-10'>
              <EmptyState survey={true} />
            </div>
          ) : null}
        </div>
      </div>
      <div className='w-full grid grid-cols-[30%_22%_22%_23%] 2xl:grid-cols-[48%_15%_15%_17%] gap-1 mt-2 font-semibold 3xl:mt-12'>
        <div className=' relative text-white leading-4 w-full flex flex-col 3xl:text-lg'>
          <span className='absolute ml-1 3xl:text-lg'>-100 </span>
          <span className='right-2 rounded-sm text-right px-1 bg-[#C8D6FF] w-full'>
            0
          </span>
          <span className='text-gray-800 text-[12px] leading-4 text-center font-medium 3xl:text-lg'>
            Significant <br /> Dissatisfaction
          </span>
        </div>
        <div className=' relative text-white leading-4 w-full flex flex-col 3xl:text-lg'>
          <span className='right-2 rounded-sm text-right px-1 bg-[#9CAEFF] w-full'>
            30
          </span>
          <span className='text-gray-800 text-[12px] leading-4 text-center font-medium 3xl:text-lg'>
            Room for <br /> improvement
          </span>
        </div>
        <div className=' relative text-white leading-4 w-full flex flex-col 3xl:text-lg'>
          <span className='right-2 rounded-sm text-right px-1 bg-[#6890FF] w-full'>
            70
          </span>
          <span className='text-gray-800 text-[12px] leading-4 text-center font-medium 3xl:text-lg'>
            Healthy <br /> satisfaction
          </span>
        </div>
        <div className=' relative text-white leading-4 w-full flex flex-col 3xl:text-lg'>
          <span className='right-2 rounded-sm text-right px-1 bg-[#2D59FD] w-full'>
            100
          </span>
          <span className='text-gray-800 text-[12px] leading-4 text-center font-medium 3xl:text-lg'>
            Exceptional <br /> satisfaction
          </span>
        </div>
      </div>
    </div>
  );
};

export default ENPS;
