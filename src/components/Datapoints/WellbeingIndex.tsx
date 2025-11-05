import CardHeader from '@/components/Common/CardHeader';
import EmptyState from '../Common/EmptyState';
import MetricCard from '../Common/MetricCard';
import { Cell, Pie, PieChart } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';

const WellbeingIndex: React.FC = () => {
  const company = useSelector((state: RootState) => state.company);
  const department = useSelector(
    (state: RootState) => state.company.selectedDepartmentId
  );

  /*

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

  if (error) {
    console.error('Wellbeing API Error:', error);
    return (
      <div className="flex flex-col lg:pb-14">
        <CardHeader title={'Wellbeing index'} />
        <EmptyState survey={true} />
      </div>
    );
  } */

  const rawScore = company.company?.departments.find(
    (d) => d.id === department
  );
  const indexValue = rawScore?.wellbeing?.score
    ? Math.round(rawScore.wellbeing.score * 100)
    : null;

  const filled = indexValue ?? 0;
  const remaining = 100 - (indexValue ?? 0);

  const dynamicChartData = [
    { name: 'Filled', value: filled, fill: '#6890FF' },
    { name: 'Remaining', value: remaining, fill: '#E0E0E0' },
  ];

  return (
    <MetricCard>
      <CardHeader
        title={'Wellbeing index'}
        tooltip={
          <>
            <h4 className="mb-2 font-semibold">The Wellbeing Index</h4>
            <p className="mb-4">
              Comes from the World Health Organization’s “WHO-5” questionnaire.
            </p>
            <p className="mb-4">
              Scores range from 0 to 100. Lower scores indicate worse
              well-being.
            </p>
          </>
        }
      />

      {indexValue === null || indexValue === 0 ? (
        <EmptyState survey={true} />
      ) : (
        <>
          <div className="flex gap-4 mb-2">
            <p className="text-title font-semibold text-sm ">
              0 <span className="text-body font-normal"> = worst possible</span>
            </p>
            <p className="text-title font-semibold text-sm ">
              100{' '}
              <span className="text-body font-normal"> = best possible</span>
            </p>
          </div>
          <div className="relative">
            <PieChart width={290} height={200} style={{ margin: '0 auto' }}>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={dynamicChartData}
                cx={140}
                cy={200}
                innerRadius={90}
                outerRadius={145}
                stroke="none"
                isAnimationActive={true}
              >
                {dynamicChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
            <p
              className="text-title text-title-xl font-semibold absolute"
              style={{
                bottom: '0%',
                left: '51%',
                transform: 'translate(-50%, -30%)',
              }}
            >
              {indexValue}
              <span className="text-sm text-gray-600 font-medium">%</span>
            </p>
          </div>

          <div className="bar relative w-[calc(100%-4rem)] mx-5 h-6 mt-[2.5rem] mb-4">
            <div className="w-full h-4 bg-[#C8D6FF] relative text-white font-semibold rounded-md leading-4">
              <p className="ml-2">0</p>
              <span className="w-[51.5%] h-full bg-[#6890FF] block absolute right-0 top-0 rounded-r-md border-l-[1px] border-title border-dashed"></span>
              <p className="absolute right-2 top-0">100</p>
            </div>
            <p className="text-sm mt-1 place-self-center mb-4">
              Under 50% indicates poor wellbeing
            </p>
          </div>
        </>
      )}
    </MetricCard>
  );
};

export default WellbeingIndex;
