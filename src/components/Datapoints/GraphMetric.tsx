import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import EmptyState from '@/components/Common/EmptyState';

interface GraphMetricData {
  date: string | undefined;
  avg: number;
}
interface GraphMetricProps {
  data: GraphMetricData[] | undefined;
}

const GraphMetric: React.FC<GraphMetricProps> = ({ data }) => {
  const chartData = data && Array.isArray(data) ? data : [];
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    });
  };

  // Data validation for specific if case
  const isDataValid =
    chartData.length > 1 ||
    (chartData.length === 1 &&
      chartData[0].avg !== 0 &&
      chartData[0].date !== undefined);

  return (
    <>
      {isDataValid ? (
        <ResponsiveContainer width='100%' height='100%' minHeight={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' tickFormatter={formatDate} />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip
              formatter={(value) => `${value}%`}
              labelFormatter={formatDate}
            />
            <Line
              type='monotone'
              dataKey='avg'
              stroke='#2D59FD'
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <EmptyState survey={false} />
      )}
    </>
  );
};

export default GraphMetric;
