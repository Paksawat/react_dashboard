import CardHeader from "@/components/Common/CardHeader";

import focus from "@/assets/focus.svg";
import stress from "@/assets/stress.svg";
import effort from "@/assets/effort.svg";
import EmptyState from "../Common/EmptyState";

const icons: Record<string, string> = {
  focus,
  stress,
  effort,
};

interface MetricDataStatsProps {
  title: string;
  value: number;
}

const MetricSingle: React.FC<MetricDataStatsProps> = ({ title, value }) => {
  const iconSrc = icons[title];

  const getTooltipContent = (title: string) => {
    if (title === "focus") {
      return (
        <>
          <h4 className="font-semibold mb-2">The Focus Metric</h4>
          <p className="mb-4">
            Measures sustained attention often referred to as vigilance, rather
            than selective attention. It focuses on top-down, deliberate, and
            effortful attentional processes, distinguishing it from automatic or
            stimulus-driven attention that is triggered by external salience.
          </p>
          <p className="mb-4">
            This Focus Metric was trained using data from participants
            completing variations of the Continuous Performance Task (CPT), a
            widely used cognitive task for measuring sustained attention. The
            experimental design allowed us to compare scenarios where
            participants needed to maintain focus for extended periods
            (requiring activation of attentional networks) against those that
            prompted mind-wandering or activation of the brain’s Default Mode
            Network (DMN).
          </p>
          <p className="mb-4">
            The Focus Metric was developed using advanced machine learning
            techniques, specifically convolutional neural networks (CNNs) in
            combination with long short-term memory (LSTM) recurrent neural
            networks. This dual-model approach allows for the capture of both
            spatial and temporal dynamics of brain activity associated with
            sustained attention.
          </p>
        </>
      );
    } else if (title === "stress") {
      return (
        <>
          <h4 className="font-semibold mb-2">The Cognitive Stress Metric</h4>
          <p className="mb-4">
            Measures mental strain induced by challenging activities or stimuli.
            Unlike physiological measures of stress (e.g., heart rate or
            cortisol levels), this metric captures the cognitive and neural
            signatures associated with the subjective experience of
            stress—particularly the feeling of being overwhelmed or mentally
            taxed by a task or situation.
          </p>
          <p className="mb-4">
            Cognitive stress plays a critical role in the brain’s feedback
            network, dynamically regulating the allocation of mental processing
            power and short-term memory resources to meet the demands of current
            mental workload. At low levels, cognitive stress helps optimize
            resource allocation by signalling the need for adjustments. However,
            as workload increases, it can push cognitive resources to their
            limits, leading to fatigue or resource depletion. When these limits
            are exceeded, cognitive stress continues to escalate, straining the
            system in an attempt to adapt. Sustained or repeated activation of
            this state can lead to negative physiological and psychological
            consequences, potentially causing long-term harm.
          </p>
          <p className="mb-4">
            Data for training this metric was collected during performance
            across variations of the Mental Arithmetic Stress Test (MAST), a
            task designed to induce cognitive stress by requiring participants
            to solve math problems of varying difficulty, both under timed and
            untimed conditions. Additionally, we incorporated data from the Cold
            Pressor Test, where participants immerse their hand in ice water for
            45 to 90 seconds, a well-known paradigm for inducing both physical
            and cognitive stress.
          </p>
          <p className="mb-4">
            Heart-rate variability (HRV) was also recorded during these tasks to
            provide an additional layer of information for model training. The
            integration of HRV data with behavioral indicators (e.g. reaction
            times and error rates) enhanced the precision of the Cognitive
            Stress PM by aligning neural data with real-time performance under
            stress-inducing conditions.
          </p>
          <p className="mb-4">
            As with the Focus Metric, development of the Cognitive Stress Metric
            employed CNNs and LSTM neural networks to capture the complex
            interaction between brain states, stress responses, and task
            performance.
          </p>
        </>
      );
    } else if (title === "effort") {
      return (
        <>
          <h4 className="font-semibold mb-2">The Mental Effort Metric</h4>
          <p className="mb-4">
            Measures the amount of mental effort or cognitive resources that are
            actively deployed at any given moment. Mental Effort reflects the
            burden placed on computational resources as individuals engage in
            cognitively demanding tasks.
          </p>
          <p className="mb-4">
            The same MAST paradigm used for Cognitive Stress was also employed
            to gather data for the Mental Effort Metric. However, the behavioral
            indicators used for data labeling varied between the two metrics.
            For Mental Effort, the focus was on how well participants could
            manage the mental demands of the task without becoming overwhelmed,
            as reflected by their accuracy and task completion rates.
          </p>
          <p className="mb-4">
            Development of the Cognitive Load PM also employed CNNs and LSTM
            neural networks.
          </p>
        </>
      );
    }
    // Return a default tooltip for other titles
    return (
      <>
        <h4 className="font-semibold">Important Information</h4>
        <p>
          {title} This is some important text that explains something crucial.
        </p>
      </>
    );
  };

  return (
    <div className="flex flex-row mb-4 xsm:mb-0 p-4 2xl:px-8 2xl:py-4 flex-grow relative flex-wrap gap-2 3xl:items-center pr-6 pt-2">
      <img src={iconSrc} className="w-10 3xl:w-16" alt={`${title} icon`} />
      <div className="rounded-md pb-2 ml-4 sm:ml-0 2xl:ml-0">
        <CardHeader title={title} tooltip={getTooltipContent(title)} />

        {value === null || value === 0 ? (
          <EmptyState survey={false} />
        ) : (
          <p className="text-3xl font-bold text-title 3xl:text-title-xxl">
            {value}
            <span className="text-sm text-slate-600 mr-4 3xl:text-lg">
              % avg.
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricSingle;
