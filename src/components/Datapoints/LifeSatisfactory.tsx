import CardHeader from '@/components/Common/CardHeader';
import { TiArrowSortedDown } from 'react-icons/ti';
import EmptyState from '../Common/EmptyState';
import MetricCard from '../Common/MetricCard';
import thriving from '@/assets/thriving.svg';
import struggling from '@/assets/struggling.svg';
import suffering from '@/assets/suffering.svg';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';

const icons: Record<string, string> = {
  thriving,
  struggling,
  suffering,
};

const LifeSatisfactory = () => {
  const company = useSelector((state: RootState) => state.company);
  const department = useSelector(
    (state: RootState) => state.company.selectedDepartmentId
  );

  /*

  const {
    data: lifeSatisfactionData,
    isLoading,
    error,
  } = useGetLifeSatisfactionQuery(
    {
      companyId: company?.id || '',
      departmentId: department || '',
    },
    { skip: !company?.id || !department }
  );

  const isDataLoading = isLoading || lifeSatisfactionData === undefined;

  if (isDataLoading) {
    return <CardSkeltonLoader />;
  }
 */
  const indexValue = company.company?.departments.find(
    (d) => d.id === department
  );

  const getIconForScore = (score: number) => {
    if (score < 4) return icons.suffering;
    if (score < 7) return icons.struggling;
    return icons.thriving;
  };

  const iconSrc = indexValue?.life_satisfactory?.score
    ? getIconForScore(indexValue.life_satisfactory.score)
    : '';
  const getLabelForScore = (score: number) => {
    if (score < 4) return 'Suffering';
    if (score < 7) return 'Struggling';
    return 'Thriving';
  };

  const calculateNeedleLeft = (score: number) => {
    if (score < 4) return (score / 4) * 33;
    if (score < 7) return ((score - 4) / 3) * 33 + 33;
    return ((score - 6.9) / 3) * 30 + 64;
  };

  const shouldShowEmpty = !indexValue || !indexValue.life_satisfactory;

  return (
    <MetricCard>
      <div className="w-full h-full relative">
        <CardHeader
          title={'Average Life Satisfactory'}
          tooltip={
            <>
              <h4 className="mb-2 font-semibold">Average Life Satisfactory</h4>
              <p className="mb-4">
                This score represents how individuals rate their current life on
                a scale from 0 to 10, based on the{' '}
                <strong>Cantril Self-Anchoring Ladder</strong>, a widely used
                measure of wellbeing.
              </p>
              <p className="mb-4">
                Participants imagine a ladder with steps numbered from 0 (the
                worst possible life) to 10 (the best possible life), and
                indicate which step they feel they are currently on.
              </p>
              <p className="mb-4">
                Each step reflects a general life satisfaction category:
              </p>
              <p className="mb-4">
                <strong>0–&lt;1:</strong> Hopeless
                <br />
                <strong>1–&lt;2:</strong> Depressed
                <br />
                <strong>2–&lt;3:</strong> Suffering
                <br />
                <strong>3–&lt;4:</strong> Struggling
                <br />
                <strong>4–&lt;5:</strong> Coping
                <br />
                <strong>5–&lt;6:</strong> Just Okay
                <br />
                <strong>6–&lt;7:</strong> Doing Well
                <br />
                <strong>7–&lt;8:</strong> Blooming
                <br />
                <strong>8–&lt;9:</strong> Thriving
                <br />
                <strong>9–10:</strong> Prospering
              </p>
              <p className="mb-4">
                A higher average score suggests better overall wellbeing and
                life satisfaction across your team or organization.
              </p>
            </>
          }
        />
        {shouldShowEmpty ? (
          <EmptyState survey={true} />
        ) : (
          <>
            <div className="flex gap-4 mb-2 min-h-[50px] relative z-99">
              <p className="text-title font-semibold text-sm">
                0{' '}
                <span className="text-body font-normal"> = worst possible</span>
              </p>
              <p className="text-title font-semibold text-sm">
                10{' '}
                <span className="text-body font-normal text-sm">
                  = best possible
                </span>
              </p>
            </div>

            <div className="flex items-center flex-col xl:flex-row w-[90%] mx-auto mb-[100px]">
              <div className="2xl:w-2/5 flex items-center justify-center w-full mb-4 xl:mb-0">
                <p className="font-semibold text-title text-title-lg">
                  {getLabelForScore(indexValue.life_satisfactory.score!)}
                </p>
              </div>
              <div className="2xl:w-2/5 flex items-center justify-center w-full mb-4 xl:mb-0">
                <img src={iconSrc} className="w-[8rem]" alt="icon" />
              </div>
            </div>

            <div className="bar relative xl:absolute xl:bottom-2 w-full h-8 mt-[2.5rem] lg:mt-[3.5rem] pr-4">
              <div
                className="absolute -top-10 z-10 flex flex-col items-center pointer-events-none"
                style={{
                  left: `${calculateNeedleLeft(
                    indexValue.life_satisfactory.score!
                  )}%`,
                  transform: 'translateX(-40%)',
                }}
              >
                <div className="text-center leading-none -mb-2">
                  <p className="text-title text-title-md font-semibold ">
                    {indexValue?.life_satisfactory.score.toFixed(1)}
                  </p>
                </div>
                <TiArrowSortedDown className="needle text-2xl text-[#2D59FD] leading-none" />
              </div>

              <div className="w-full grid grid-cols-[33%_33%_33%] gap-1 font-semibold">
                <div className="relative text-white leading-4 w-full flex flex-col">
                  <span className="rounded-sm px-1 bg-[#9CAEFF] w-full">0</span>
                  <span className="text-gray-800 text-sm text-center font-medium">
                    Suffering area
                  </span>
                </div>
                <div className="relative text-white leading-4 w-full flex flex-col">
                  <span className="rounded-sm px-1 bg-[#6890FF] w-full">4</span>
                  <span className="text-gray-800 text-sm text-center font-medium">
                    Struggling area
                  </span>
                </div>
                <div className="relative text-white leading-4 w-full flex flex-col">
                  <span className="absolute ml-1">7</span>
                  <span className="text-right px-1 bg-[#2D59FD] w-full rounded-sm">
                    10
                  </span>
                  <span className="text-gray-800 text-sm text-center font-medium">
                    Thriving area
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MetricCard>
  );
};

export default LifeSatisfactory;
