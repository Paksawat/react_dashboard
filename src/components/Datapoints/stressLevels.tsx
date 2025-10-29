import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import Loader from '@/components/Common/Loader';

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useGetDepartmentStressLevelsQuery } from '@/api/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import CardHeader from '@/components/Common/CardHeader';

const chartConfig = {
  optimal: {
    label: 'Optimal',
    color: 'hsl(var(--chart-1))',
  },
  balanced: {
    label: 'Balanced',
    color: 'hsl(var(--chart-2))',
  },
  moderate: {
    label: 'Moderate',
    color: 'hsl(var(--chart-3))',
  },
  unfavorable: {
    label: 'Unfavorable',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

const StressLevels = () => {
  const company = useSelector((state: RootState) => state.company);
  const department = useSelector((state: RootState) =>
    state.company.company?.departments?.find(
      (dept) => dept.id === company.selectedDepartmentId
    )
  );
  const {
    data,
    isLoading,
    error: stressLevelError,
  } = useGetDepartmentStressLevelsQuery(
    {
      companyId: company?.company?.id || '0',
      departmentId: company.selectedDepartmentId || '0',
    },
    { skip: !company?.company?.id || !company.selectedDepartmentId }
  );

  const chartData = data?.[0]?.stressLevels?.map((entry) => {
    const entryDate = entry.date ? new Date(entry.date) : null;
    const dailyAvg =
      (department?.dailyMetricsHistory ?? []).find((avg) => {
        if (!avg.date || !entryDate) return false;
        return (
          new Date(avg.date).toLocaleDateString('en-GB') ===
          entryDate.toLocaleDateString('en-GB')
        );
      })?.calmAverage ?? 0;

    return {
      date: entryDate
        ? entryDate.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })
        : 'Invalid Date',
      optimal: entry.optimal,
      balanced: entry.balanced,
      moderate: entry.moderate,
      unfavorable: entry.unfavorable,
      avg: dailyAvg,
    };

    /*     return {
      date: entryDate
        ? entryDate.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })
        : 'Invalid Date',
      optimal: (entry.optimal / 100) * dailyAvg,
      balanced: (entry.balanced / 100) * dailyAvg,
      moderate: (entry.moderate / 100) * dailyAvg,
      unfavorable: (entry.unfavorable / 100) * dailyAvg,
      avg: dailyAvg,
    }; */
  });

  return (
    <div className="w-full flex flex-col my-4 min-h-67">
      <CardHeader
        title={'Weekly stress levels'}
        tooltip={
          <>
            <h4 className="font-semibold">Weekly stress levels</h4>
            <p className="mb-4">
              Stress level categories are predicated on the core Cognitive
              Stress Metric. They are based on a logarithmic function that
              produces positive scores during periods of manageable or adaptive
              cognitive stress and negative scores during periods of
              unmanageable or maladaptive stress. The logarithmic function and
              resulting “states” are based on behavioral data from cognitive
              tasks.
            </p>
            <p className="mb-4">
              Machine-learning models were used that characterize the neural
              signatures associated with each target cognitive state. In
              addition to EEG, behavioral and self-reported metrics were used to
              label data for machine-learning training purposes. This
              integration of multimodal data sources improves the accuracy and
              relevance of the resulting models.
            </p>
          </>
        }
      />
      <div>
        <p>
          Average stress level of stress per day and percentage of productive
          and unproductive stress
        </p>
      </div>
      {stressLevelError ? (
        <div className="text-center text-xl mt-4">No data available</div>
      ) : isLoading ? (
        <Loader />
      ) : (
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const dateParts = value.split('/');
                const day = dateParts[0];
                const month = dateParts[1];
                return `${day}/${month}`;
              }}
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              tickFormatter={(tick) => `${Math.round(tick * 100)}%`}
            />

            {/*  <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickCount={5}
              tickFormatter={(tick) => `${tick}%`}
            /> */}
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="unfavorable"
              stackId="a"
              fill="#2D59FD"
              radius={[0, 0, 4, 4]}
            />
            <Bar dataKey="moderate" stackId="a" fill="#8BA9FF" />
            <Bar dataKey="balanced" stackId="a" fill="#C3CEFF" />
            <Bar
              dataKey="optimal"
              stackId="a"
              fill="#E6EDFF"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default StressLevels;
