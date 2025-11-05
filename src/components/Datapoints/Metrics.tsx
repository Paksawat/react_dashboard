import { useSelector } from 'react-redux';
import MetricSingle from './MetricSingle';
import { RootState } from '@/stores/store';

const Metrics = () => {
  const company = useSelector((state: RootState) => state.company);
  const department = useSelector(
    (state: RootState) => state.company.selectedDepartmentId
  );
  /*
  const {
    data: metrics,
    isLoading,
    error,
  } = useGetDepartmentMetricsQuery(
    {
      companyId: company?.id || '0',
      departmentId: department || '0',
    },
    { skip: !company?.id || !department }
  );

  const isDataLoading = isLoading || !metrics || !!error; */

  const dataResult = company.company?.departments.find(
    (d) => d.id === department
  );

  const mappedMetrics = [
    { title: 'focus', value: dataResult?.metrics.focus ?? null },
    { title: 'stress', value: dataResult?.metrics.calm ?? null },
    { title: 'effort', value: dataResult?.metrics.cognitiveEffort ?? null },
  ];
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {mappedMetrics &&
        mappedMetrics.map(({ title, value }) => (
          <div
            key={title}
            className="bg-white rounded-lg shadow-default flex-grow"
          >
            <MetricSingle title={title} value={value} />
          </div>
        ))}
    </div>
  );
};

export default Metrics;
