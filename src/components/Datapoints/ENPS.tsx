import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Pie, PieChart } from 'recharts';
import CardHeader from '../Common/CardHeader';
import EmptyState from '../Common/EmptyState';
import MetricCard from '../Common/MetricCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';

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
    value: item.value / totalResponses,
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
  const company = useSelector((state: RootState) => state.company);
  const department = useSelector(
    (state: RootState) => state.company.selectedDepartmentId
  );

  /* const {
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
  const isDataLoading = isLoading || enpsData === undefined;

  if (isDataLoading) {
    return <CardSkeltonLoader />;
  }

  if (error) {
    return (
      <div className="flex flex-col mt-2 lg:mb-10 gap-4">
        <CardHeader title={'Employee NPS'} />
        <EmptyState survey={true} />
      </div>
    );
  }  */

  const dataResult = company?.company?.departments.find(
    (d) => d.id === department
  );

  const currentNPS = dataResult?.enps.score
    ? Math.round(dataResult?.enps.score)
    : null;

  // Use real data from the API for the pie chart
  const totalResponses = dataResult
    ? dataResult?.enps.promoters +
      dataResult?.enps.passives +
      dataResult?.enps.detractors
    : 0;
  const employerNPS =
    dataResult && totalResponses > 0
      ? [
          { label: 'Promoters', value: dataResult?.enps.promoters },
          { label: 'Passive', value: dataResult?.enps.passives },
          { label: 'Detractors', value: dataResult?.enps.detractors },
        ]
      : [];

  // Merge data with colors
  const result = mergeDataWithColors(employerNPS, colorFill, totalResponses);

  return (
    <MetricCard>
      <CardHeader
        title={'Employee NPS'}
        tooltip={
          <>
            <h4 className="mb-2 font-semibold">
              The eNPS is an employee experience metric
            </h4>
            <p className="mb-4">
              Its calculated score ranges between -100 and 100 to determine the
              group of ambassadors in your organization and how loyal your
              employees are. The employee is offered an 11-point scale from 0 to
              10, with 0 being not at all likely to 10 extremely likely.
            </p>
            <p className="mb-4">
              Employee responses are grouped into three categories as follows:
              <ul className="ml-4">
                <li>1. Ratings between 0 and 6 are considered detractors.</li>
                <li>2. Ratings between 7 and 8 are considered passives.</li>
                <li>3. Ratings between 9 and 10 are considered promoters</li>
              </ul>
            </p>
            <p className="mb-4">
              Promoters are extremely loyal employees who are more likely to
              spread positive word of mouth about your organization. Passives
              are neutral; these employees are neither emotionally invested nor
              disengaged. Detractors are more likely to spread negative word of
              mouth about your organization and appear disengaged and
              dissatisfied.
            </p>
            <p className="mb-4">
              The eNPS is calculated like this: ((Number of employee promoters –
              Number of employee detractors) / Total responses) x 100.
            </p>
          </>
        }
      />
      {currentNPS !== null ? (
        <>
          <div className="flex items-center flex-col xl:flex-row w-[90%] justify-self-center">
            <div className="flex flex-col items-center 2xl:w-2/5">
              <h2 className="font-semibold text-title text-title-lg 2xl:text-title-xl ">
                {Math.round(currentNPS ?? 0)}
              </h2>
              <span>Current score</span>
            </div>
            <div className="flex flex-col items-center sm:flex-row lg:flex-col xl:flex-row lg:h-[15rem] lg:mb-[50px] xl:mb-0">
              {currentNPS !== null && result.length > 0 && (
                <>
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] min-h-[200px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={result}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={30}
                      />
                    </PieChart>
                  </ChartContainer>
                  <div className="flex gap-2 sm:flex-col lg:flex-row xl:flex-col">
                    {result.map((item) => (
                      <div key={item.label} className="flex gap-2 flex-wrap">
                        <span
                          className={`w-4 h-4 block rounded-lg`}
                          style={{ backgroundColor: item.fill }}
                        ></span>
                        <span className="font-semibold text-center text-title min-w-8">
                          {totalResponses > 0
                            ? Math.round(item.value * 100)
                            : 0}
                          %
                        </span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="bar w-[calc(100%-2rem)] grid grid-cols-[30%_22%_22%_23%] gap-1 mt-2 font-semibold lg:absolute lg:bottom-4">
            <div className=" relative text-white leading-4 w-full flex flex-col ">
              <span className="absolute ml-1 ">-100 </span>
              <span className="right-2 rounded-sm text-right px-1 bg-[#C8D6FF] w-full">
                0
              </span>
              <span className="text-gray-800 text-sm leading-4 text-center font-medium ">
                Significant <br /> Dissatisfaction
              </span>
            </div>
            <div className=" relative text-white leading-4 w-full flex flex-col ">
              <span className="right-2 rounded-sm text-right px-1 bg-[#9CAEFF] w-full">
                30
              </span>
              <span className="text-gray-800 text-sm leading-4 text-center font-medium ">
                Room for <br /> improvement
              </span>
            </div>
            <div className=" relative text-white leading-4 w-full flex flex-col ">
              <span className="right-2 rounded-sm text-right px-1 bg-[#6890FF] w-full">
                70
              </span>
              <span className="text-gray-800 text-sm leading-4 text-center font-medium ">
                Healthy <br /> satisfaction
              </span>
            </div>
            <div className=" relative text-white leading-4 w-full flex flex-col ">
              <span className="right-2 rounded-sm text-right px-1 bg-[#2D59FD] w-full">
                100
              </span>
              <span className="text-gray-800 text-sm leading-4 text-center font-medium ">
                Exceptional <br /> satisfaction
              </span>
            </div>
          </div>
        </>
      ) : (
        <EmptyState survey={true} />
      )}
    </MetricCard>
  );
};

export default ENPS;
