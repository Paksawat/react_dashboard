import { useGetDepartmentMetricsQuery } from '@/api/apiSlice';
import { RootState } from '@/stores/store';
import { MetricsData } from '@/types/metricTypes';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MetricSingle from './MetricSingle';
import Loader from '@/components/Common/Loader';

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

  useEffect(() => {
    if (data) {
      setMetrics(data);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <>
        {['focus', 'strss', 'effort'].map((title) => (
          <div
            key={title}
            className='bg-white rounded-lg shadow-default flex-grow'
          >
            <MetricSingle title={title} value={0} />
          </div>
        ))}
      </>
    );
  }
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
    <>
      {mappedMetrics &&
        mappedMetrics.map(([title, value]) => (
          <div
            key={title}
            className='bg-white rounded-lg shadow-default flex-grow'
          >
            <MetricSingle title={title} value={value} />
          </div>
        ))}
    </>
  );
};

export default Metrics;
