import { useGetDepartmentMetricsQuery } from '@/api/apiSlice';
import { RootState } from '@/stores/store';
import { MetricsData } from '@/types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '@/components/Common/Loader';
import MetricSingle from '@/components/Datapoints/MetricSingle';
import GraphMetric from '@/components/Datapoints/GraphMetric';

const Metrics = () => {
  const company = useSelector((state: RootState) => state.company.company);
  const department = useSelector(
    (state: RootState) => state.company.selectedDepartmentId
  );
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const { data, isLoading, error } = useGetDepartmentMetricsQuery(
    {
      companyId: company?.id || '0',
      departmentId: department || '0',
    },
    { skip: !company?.id || !department }
  );
  const dailyMetricsHistory =
    company?.departments?.[0]?.weeklyMetricsHistory
      ?.sort(
        (a, b) =>
          new Date(a.date || '').getTime() - new Date(b.date || '').getTime()
      )
      .slice(0, 5) || [];

  useEffect(() => {
    if (data) {
      setMetrics(data);
    }
  }, [data, company]);

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <div>No Data</div>;
  }

  const mapData = (field: string) => {
    return dailyMetricsHistory.map((item) => {
      const mappedData: { date: string | undefined; avg: number } = {
        date: item.date,
        avg: 0,
      };

      switch (field) {
        case 'focus':
          mappedData.avg = item.focusAverage;
          break;
        case 'stress':
          mappedData.avg = item.calmAverage;
          break;
        case 'effort':
          mappedData.avg = item.cognitiveEffortAverage;
          break;
        default:
          break;
      }

      return mappedData;
    });
  };

  const titleMapping: { [key: string]: string } = {
    focus: 'focus',
    calm: 'stress',
    cognitiveEffort: 'effort',
  };

  const mappedMetrics = metrics
    ? Object.entries(metrics).map(([key, value]) => {
        const displayTitle = titleMapping[key] || key;
        return [displayTitle, value];
      })
    : [];

  return (
    <div>
      <h2 className="text-title-lg font-semibold text-title my-2 3xl:text-title-xxl">
        Metrics
      </h2>

      <div className=" gap-4 flex flex-col md:gap-4 2xl:gap-6 w-full flex-grow 3xl:grid-rows-[200px_300px_400px] ">
        {mappedMetrics &&
          mappedMetrics.map(([title, value]) => {
            return (
              <div
                key={title}
                className="bg-white rounded-lg shadow-default flex-grow flex w-full h-full  p-4 relative flex-col items-center md:flex-row "
              >
                <MetricSingle title={title} value={value} />
                <GraphMetric data={mapData(title)} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Metrics;
