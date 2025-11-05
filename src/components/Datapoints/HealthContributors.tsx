import CardHeader from '../Common/CardHeader';
import EmptyState from '../Common/EmptyState';
import { Cell, Pie, PieChart } from 'recharts';
import MetricCard from '../Common/MetricCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';

const colorMap = [
  {
    label: 'Energy',
    color: '#DFD05D',
  },
  {
    label: 'Workload',
    color: '#7B46D8',
  },
  {
    label: 'Confidence',
    color: '#4189C5',
  },
  {
    label: 'Mood',
    color: '#3FCEA1',
  },
];

const HealthContributors = ({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean;
}) => {
  const company = useSelector((state: RootState) => state.company);
  const department = useSelector(
    (state: RootState) => state.company.selectedDepartmentId
  );

  /*  const {
    data: contributorsData,
    isLoading,
    error,
  } = useGetMentalHealthContributorsQuery(
    {
      companyId: company?.id || '',
      departmentId: department || '',
    },
    { skip: !company?.id || !department }
  );

  const isDataLoading = isLoading || contributorsData === undefined;

  if (isDataLoading) {
    return <CardSkeltonLoader />;
  }

  if (error) {
    return (
      <>
        <CardHeader title={'Potential mental health contributors'} />
        <EmptyState survey={true} />
      </>
    );
  } */

  const dataResult = company.company?.departments.find(
    (d) => d.id === department
  );

  // Convert the flat structure to an array for rendering
  // Also convert decimal values to percentages
  const contributors = dataResult
    ? [
        {
          id: 'confidence',
          name: 'Confidence',
          impact: Math.round(dataResult.health_contributors.confidence * 100),
          color: colorMap.find((c) => c.label === 'Confidence')?.color,
        },
        {
          id: 'energy',
          name: 'Energy',
          impact: Math.round(dataResult.health_contributors.energy * 100),
          color: colorMap.find((c) => c.label === 'Energy')?.color,
        },
        {
          id: 'mood',
          name: 'Mood',
          impact: Math.round(dataResult.health_contributors.mood * 100),
          color: colorMap.find((c) => c.label === 'Mood')?.color,
        },
        {
          id: 'workload',
          name: 'Workload',
          impact: Math.round(dataResult.health_contributors.workload * 100),
          color: colorMap.find((c) => c.label === 'Workload')?.color,
        },
      ]
    : [];

  return (
    <MetricCard>
      <CardHeader
        title={'Potential mental health contributors'}
        tooltip={
          <>
            <h4 className="font-semibold mb-2">Mental Health Contributors</h4>
            <p className="mb-4">
              These factors contribute to the overall mental health and
              wellbeing of the department. Higher impact values indicate
              stronger influence on mental health outcomes.
            </p>
          </>
        }
      />

      {contributors.length === 0 ||
      contributors.every((c) => c.impact === 0) ? (
        <EmptyState survey={true} />
      ) : (
        <div className="flex flex-col lg:flex-col md:flex-row md:gap-6 items-center">
          <div className="flex-1 flex justify-center min-w-[300px] max-w-[500px]">
            <PieChart width={380} height={200}>
              <Pie
                data={contributors}
                dataKey="impact"
                nameKey="name"
                startAngle={180}
                endAngle={0}
                label
                cx="50%"
                cy="100%"
                outerRadius="150%"
                isAnimationActive={isAnimationActive}
              >
                {contributors
                  .sort((a, b) => b.impact - a.impact)
                  .map((entry) => {
                    const colorInfo = colorMap.find(
                      (c) => c.label === entry.name
                    );
                    const fillColor = colorInfo ? colorInfo.color : '#ccc';
                    return (
                      <Cell key={entry.id} fill={fillColor} tabIndex={-1} />
                    );
                  })}
              </Pie>
            </PieChart>
          </div>
          <div className="mt-4 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {contributors
              .sort((a, b) => b.impact - a.impact)
              .map((contributor) => (
                <div key={contributor.id} className="w-full">
                  <h3 className="text-md font-semibold text-title">
                    {contributor.name} - {contributor.impact}{' '}
                    <span className="text-sm">%</span>
                  </h3>
                  <div className="h-4 bg-opacity-20 rounded-lg relative w-full">
                    <div
                      className="h-full rounded-lg absolute top-0 z-0"
                      style={{
                        width: `${contributor.impact}%`,
                        backgroundColor: contributor.color,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </MetricCard>
  );
};

export default HealthContributors;
