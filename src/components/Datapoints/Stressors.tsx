import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';
import { useGetMentalHealthContributorsQuery } from '@/api/apiSlice';
import CardHeader from '../Common/CardHeader';
import EmptyState from '../Common/EmptyState';
import Loader from '../Common/Loader';

// Using the type from the API slice instead of defining locally

const colorMap = [
  {
    label: 'Energy',
    color: '#2FF0B3',
    lightColor: 'rgba(47, 240, 179, 0.2)',
    textColor: '#177658',
  },
  {
    label: 'Workload',
    color: '#9E66FF',
    lightColor: 'rgba(158, 102, 255, 0.2)',
    textColor: '#3C1B76',
  },
  {
    label: 'Confidence',
    color: '#66BAFF',
    lightColor: 'rgba(102, 186, 255, 0.2)',
    textColor: '#18456B',
  },
  {
    label: 'Mood',
    color: '#FFAD66',
    lightColor: 'rgba(255, 173, 102, 0.2)',
    textColor: '#764113',
  },
];

const Stressors = () => {
  const company = useSelector((state: RootState) => state.company.company);
  const department = useSelector(
    (state: RootState) => state.company.selectedDepartmentId
  );

  const {
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

  // Convert the flat structure to an array for rendering
  // Also convert decimal values to percentages
  const contributors = contributorsData
    ? [
        {
          id: 'confidence',
          name: 'Confidence',
          impact: Math.round(contributorsData.confidence * 100),
        },
        {
          id: 'energy',
          name: 'Energy',
          impact: Math.round(contributorsData.energy * 100),
        },
        {
          id: 'mood',
          name: 'Mood',
          impact: Math.round(contributorsData.mood * 100),
        },
        {
          id: 'workload',
          name: 'Workload',
          impact: Math.round(contributorsData.workload * 100),
        },
      ]
    : [];

  console.log('Contributors Data:', contributorsData);
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <>
        <CardHeader title={'Potential mental health contributors'} />
        <EmptyState survey={true} />
      </>
    );
  }

  return (
    <>
      <CardHeader
        title={'Potential mental health contributors'}
        tooltip={
          <>
            <h4 className='font-semibold mb-2'>Mental Health Contributors</h4>
            <p className='mb-4'>
              These factors contribute to the overall mental health and
              wellbeing of the department. Higher impact values indicate
              stronger influence on mental health outcomes.
            </p>
          </>
        }
      />
      <div className='flex flex-wrap gap-6 w-full my-4'>
        {contributors.length === 0 ? (
          <EmptyState survey={true} />
        ) : (
          contributors
            .sort((a, b) => (b.impact ?? 0) - (a.impact ?? 0))
            .map((contributor) => {
              const colorInfo =
                colorMap.find((c) => c.label === contributor.name) ||
                colorMap[0]; // Fallback to first color if not found
              const backgroundColor = colorInfo.lightColor;
              const barColor = colorInfo.color;

              return (
                <div key={contributor.id}>
                  <h3 className='text-md font-semibold text-title 3xl:text-title-lg'>
                    {contributor.name}{' '}
                    <span className='text-sm 3xl:text-lg'>%</span>
                  </h3>
                  <div
                    className='w-30 h-4 bg-opacity-20 rounded-lg relative 3xl:w-50 3xl:h-5'
                    style={{ backgroundColor }}
                  >
                    <p className='absolute z-10 leading-4 text-center w-full text-black font-semibold'>
                      {contributor.impact}
                    </p>
                    <div
                      className='h-full rounded-lg absolute top-0 z-0'
                      style={{
                        width: `${contributor.impact}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                </div>
              );
            })
        )}
      </div>
    </>
  );
};

export default Stressors;
