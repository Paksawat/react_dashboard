import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Legend,
  Tooltip,
  LegendType,
  YAxis,
} from 'recharts';
import { CardContent, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import CardHeader from '../Common/CardHeader';
import { useState } from 'react';

const chartData = [
  { date: '2025-06-26T00:00:00+00:00', focus: 0.45, stress: 0.8, effort: 0.36 },
  { date: '2025-06-27T00:00:00+00:00', focus: 0.3, stress: 0.2, effort: 0.75 },
  {
    date: '2025-06-28T00:00:00+00:00',
    focus: 0.23,
    stress: 0.22,
    effort: 0.45,
  },
  {
    date: '2025-06-29T00:00:00+00:00',
    focus: 0.73,
    stress: 0.56,
    effort: 0.56,
  },
  { date: '2025-06-30T00:00:00+00:00', focus: 0.2, stress: 0.33, effort: 0.89 },
];

const chartConfig = {
  focus: {
    label: 'Focus',
    color: '#133D54',
  },
  stress: {
    label: 'Stress',
    color: '#39D6B9',
  },
  effort: {
    label: 'Effort',
    color: '#0E848F',
  },
} satisfies ChartConfig;

const MetricsChart = () => {
  //const company = useSelector((state: RootState) => state.company);

  /*
  const { data } = useGetDepartmentMetricsQuery(
    {
      companyId: company?.company?.id || '0',
      departmentId: company.selectedDepartmentId || '0',
    },
    { skip: !company?.company?.id || !company.selectedDepartmentId }
  );
  */

  const [visibleLines, setVisibleLines] = useState({
    focus: true,
    stress: true,
    effort: true,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLegendClick = (e: any) => {
    const key = e.dataKey as keyof typeof visibleLines;
    setVisibleLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
    });
  }
  const legendPayload = Object.entries(chartConfig).map(([key, config]) => ({
    value: config.label,
    id: key,
    type: 'line' as LegendType,
    color: config.color,
    dataKey: key,
    inactive: !visibleLines[key as keyof typeof visibleLines],
  }));

  return (
    <div className='w-full p-0'>
      <CardHeader title={'Weekly metric levels'} />
      <CardDescription>
        Average metric levels for the last 5 working days
      </CardDescription>
      <CardContent className='w-full p-0 pr-4 pt-4'>
        <ChartContainer config={chartConfig} className='w-full p-0'>
          <LineChart
            data={chartData}
            margin={{ left: 22, right: 12, bottom: 24 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatDate}
            />
            <YAxis
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              tickCount={6}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload) return null;
                const formatted = formatDate(label);
                return (
                  <div className='rounded border bg-white p-2 shadow-sm text-sm'>
                    <div className='font-medium border-b-2'>{formatted}</div>
                    {payload.map((entry) => (
                      <div key={entry.name} className='flex justify-between'>
                        <span
                          className='mr-2 font-medium'
                          style={{ color: entry.stroke }}
                        >
                          {entry.name}
                        </span>
                        <span>
                          {typeof entry.value === 'number'
                            ? `${(entry.value * 100).toFixed(0)}%`
                            : 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            <Legend
              className='cursor-pointer'
              verticalAlign='bottom'
              height={36}
              onClick={handleLegendClick}
              payload={legendPayload}
              wrapperStyle={{ marginTop: 24, cursor: 'pointer' }}
            />

            {visibleLines.focus && (
              <Line
                dataKey='focus'
                type='monotone'
                stroke='var(--color-focus)'
                strokeWidth={2}
                dot={{ fill: 'var(--color-focus)' }}
              />
            )}
            {visibleLines.stress && (
              <Line
                dataKey='stress'
                type='monotone'
                stroke='var(--color-stress)'
                strokeWidth={2}
                dot={{ fill: 'var(--color-stress)' }}
              />
            )}
            {visibleLines.effort && (
              <Line
                dataKey='effort'
                type='monotone'
                stroke='var(--color-effort)'
                strokeWidth={2}
                dot={{ fill: 'var(--color-effort)' }}
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
};

export default MetricsChart;
