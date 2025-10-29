import { SurveyQuestion } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Switch } from '../ui/switch';
import { ChangeEvent, useState } from 'react';

interface QuestionItemProps {
  question: SurveyQuestion;
  questionIndex: number;
  onChange: (question: SurveyQuestion) => void;
  onRemove: () => void;
}

const metricTypes = [
  { title: 'None', value: 'None' },
  { title: 'Wellbeing Index', value: 'WHO5' },
  { title: 'Health Contributors', value: 'MHC' },
  { title: 'eNPS', value: 'ENPS' },
  { title: 'Life Satisfactory', value: 'Life' },
];

const metricKeys = [
  { title: 'None', value: 'None' },
  { title: 'Thought control', value: 'ThoughtControl' },
  { title: 'Mood', value: 'Mood' },
  { title: 'I felt calm and relaxed', value: 'IFeltCalmAndRelaxed' },
  { title: 'Energy', value: 'Energy' },
  { title: 'Sleep', value: 'Sleep' },
  { title: 'Interest', value: 'Interest' },
  { title: 'Workload', value: 'Workload' },
  {
    title: 'Private life balance',
    value: 'PrivateLifeBalance',
  },
  { title: 'Confidence', value: 'Confidence' },
  { title: 'Open ended', value: 'OpenEnded' },
];

const questionTypes = [
  { title: 'Single Choice', value: 0 },
  { title: 'Multiple Choice', value: 1 },
  { title: 'Likert Scale', value: 2 },
  { title: '0-10 Scale', value: 3 },
];

const likertOptions = ['0', '1', '2', '3', '4', '5'];
const scale0To10Options = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
];

const QuestionItem = ({
  question,
  questionIndex,
  onChange,
  onRemove,
}: QuestionItemProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true); // Default to collapsed

  const handleQuestionTextChange = (value: string) => {
    onChange({ ...question, questionText: value });
  };

  const handleQuestionPrefixChange = (value: string) => {
    onChange({ ...question, prefix: value });
  };

  const handleQuestionSubtextChange = (value: string) => {
    onChange({ ...question, questionSubtext: value });
  };

  const handleTypeChange = (value: number) => {
    let updatedOptions = question.surveyOptions;

    if (value === 2) {
      updatedOptions = [...likertOptions];
    } else if (value === 3) {
      updatedOptions = [...scale0To10Options];
    } else if (value === 1 || value === 0) {
      updatedOptions = [];
    }

    const updatedQuestion = {
      ...question,
      type: value as number,
      surveyOptions: updatedOptions,
    };

    onChange(updatedQuestion);
  };

  const handleMetricChange = (
    index: number,
    key: 'metricType' | 'metricKey',
    value: string
  ) => {
    const updatedMetricType = [...(question.metricType ?? [])];
    const updatedMetricKey = [...(question.metricKey ?? [])];

    if (key === 'metricType') {
      updatedMetricType[index] = value;
    } else {
      updatedMetricKey[index] = value;
    }

    onChange({
      ...question,
      metricType: updatedMetricType,
      metricKey: updatedMetricKey,
    });
  };

  const handleAddMetric = () => {
    onChange({
      ...question,
      metricType: [...(question.metricType ?? []), 'None'],
      metricKey: [...(question.metricKey ?? []), 'None'],
    });
  };

  const handleRemoveMetric = (index: number) => {
    onChange({
      ...question,
      metricType: (question.metricType ?? []).filter((_, i) => i !== index),
      metricKey: (question.metricKey ?? []).filter((_, i) => i !== index),
    });
  };

  const handleSkippableChange = (value: boolean) => {
    onChange({ ...question, isSkippable: value });
  };

  const handleOptionChange = (optionIndex: number, text: string) => {
    const updatedOptions = [...question.surveyOptions];
    updatedOptions[optionIndex] = text;
    onChange({ ...question, surveyOptions: updatedOptions });
  };

  // Set department value
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  // Add tag to list
  const handleAdd = () => {
    if (inputValue.trim() !== '') {
      const updatedTags = [...(question.tags ?? []), inputValue.trim()];
      onChange({ ...question, tags: updatedTags });
      setInputValue(''); // still clear input locally
    }
  };

  // add tag trigger
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  // remove tag from list
  const handleRemove = (indexToRemove: number): void => {
    const updatedTags = (question.tags ?? []).filter(
      (_, index) => index !== indexToRemove
    );
    onChange({ ...question, tags: updatedTags });
  };

  const addOption = () => {
    onChange({
      ...question,
      surveyOptions: [...question.surveyOptions, ''],
    });
  };

  const removeOption = (optionIndex: number) => {
    const updatedOptions = [...question.surveyOptions];
    updatedOptions.splice(optionIndex, 1);
    onChange({ ...question, surveyOptions: updatedOptions });
  };

  return (
    <div className='bg-white border rounded-lg overflow-hidden'>
      {/* Header - Always Visible */}
      <div className='p-4 border-b bg-gray-50'>
        <div className='flex items-center justify-between'>
          {/* Clickable Header Section */}
          <div
            className='flex items-center space-x-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors flex-1 group'
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={
              isCollapsed
                ? 'Click to expand question'
                : 'Click to collapse question'
            }
          >
            <div className='flex items-center justify-center w-8 h-8'>
              {isCollapsed ? (
                <ChevronRight className='h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors' />
              ) : (
                <ChevronDown className='h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors' />
              )}
            </div>
            <h2 className='text-title-sm text-blue-600 font-semibold group-hover:text-blue-700 transition-colors'>
              Question {questionIndex + 1}
            </h2>
            {question.questionText ? (
              <span className='text-sm text-gray-600 truncate max-w-xs'>
                {question.questionText}
              </span>
            ) : (
              <span className='text-sm text-gray-400 italic'>
                No question text yet
              </span>
            )}
          </div>

          {/* Question Remove Button */}
          <Button
            type='button'
            onClick={onRemove}
            variant='ghost'
            className='text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8'
            title='Remove Question'
          >
            <Trash2 size={16} />
          </Button>
        </div>

        {/* Preview info when collapsed */}
        {isCollapsed && (
          <div className='flex items-center space-x-4 text-xs text-gray-500 mt-2 ml-12'>
            <span>
              Type:{' '}
              {questionTypes.find((t) => t.value === question.type)?.title}
            </span>
            {question.surveyOptions.length > 0 && (
              <span>• {question.surveyOptions.length} options</span>
            )}
            {question.tags && question.tags.length > 0 && (
              <span>• {question.tags.length} tags</span>
            )}
            {question.isSkippable === false && <span>• Required</span>}
          </div>
        )}
      </div>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'
        }`}
      >
        <div className='p-6 space-y-4'>
          <div>
            <Label
              htmlFor={`question-text-${questionIndex}`}
              className='block text-sm font-semibold'
            >
              Question Prefix
            </Label>
            <Input
              id={`question-text-${questionIndex}`}
              type='text'
              value={question.prefix}
              onChange={(e) => handleQuestionPrefixChange(e.target.value)}
              placeholder={`Enter question prefix`}
              className='block w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <Label
              htmlFor={`question-text-${questionIndex}`}
              className='block text-sm font-semibold'
            >
              Question {questionIndex + 1}{' '}
              {!question.questionText && (
                <span className='text-red text-[.8rem]'>(required)</span>
              )}
            </Label>
            <Input
              id={`question-text-${questionIndex}`}
              type='text'
              value={question.questionText}
              onChange={(e) => handleQuestionTextChange(e.target.value)}
              placeholder={`Enter question text`}
              className={`block w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                !question.questionText
                  ? 'border-red-500 ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
          </div>

          {/* Question Subtext */}
          <div className='space-y-2'>
            <Label
              htmlFor={`question-subtext-${questionIndex}`}
              className='block text-sm font-semibold'
            >
              Question Subtext (Optional)
            </Label>
            <Input
              id={`question-subtext-${questionIndex}`}
              type='text'
              value={question.questionSubtext || ''}
              onChange={(e) => handleQuestionSubtextChange(e.target.value)}
              placeholder='Enter additional context or instructions for this question'
              className='block w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500'
            />
          </div>

          <div className='flex items-center space-x-2'>
            <Switch
              id={`skippable-${questionIndex}`}
              checked={question.isSkippable ?? true}
              onCheckedChange={handleSkippableChange}
            />
            <Label htmlFor={`skippable-${questionIndex}`}>
              Question is skippable
            </Label>
          </div>

          <div className='space-y-4'>
            <Label className='block text-sm font-semibold'>
              Metric Relations
            </Label>

            {(question.metricType ?? []).map((metricType, index) => (
              <div
                key={index}
                className='border p-3 rounded space-y-2 relative bg-gray-50'
              >
                <Button
                  type='button'
                  onClick={() => handleRemoveMetric(index)}
                  variant='ghost'
                  className='absolute top-1 right-1 text-red-500 hover:text-red-700 p-1 h-6 w-6'
                  title='Remove Metric'
                >
                  <Trash2 size={14} />
                </Button>

                <div>
                  <Label
                    htmlFor={`metric-type-${questionIndex}-${index}`}
                    className='text-sm font-semibold'
                  >
                    Metric Type
                  </Label>
                  <select
                    id={`metric-type-${questionIndex}-${index}`}
                    value={metricType}
                    onChange={(e) =>
                      handleMetricChange(index, 'metricType', e.target.value)
                    }
                    className='w-full mt-1 p-2 border rounded'
                  >
                    {metricTypes.map(({ title, value }) => (
                      <option key={value} value={value}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor={`metric-key-${questionIndex}-${index}`}
                    className='text-sm font-semibold'
                  >
                    Metric Key
                  </Label>
                  <select
                    id={`metric-key-${questionIndex}-${index}`}
                    value={question.metricKey?.[index] ?? 'None'}
                    onChange={(e) =>
                      handleMetricChange(index, 'metricKey', e.target.value)
                    }
                    className='w-full mt-1 p-2 border rounded'
                  >
                    {metricKeys.map(({ title, value }) => (
                      <option key={value} value={value}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

            <Button
              type='button'
              onClick={handleAddMetric}
              variant='outline'
              className='text-blue-600 hover:bg-blue-50 flex items-center gap-1'
            >
              <Plus size={16} />
              Add Metric
            </Button>
          </div>

          <div className='flex flex-col space-y-1.5'>
            <Label htmlFor='tags'>Tags</Label>
            <div className='flex text-sm text-gray-500'>
              <p>Add one at a time - Press "Enter" to add</p>
            </div>
            <Input
              id='tags'
              placeholder='Add a tag'
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
            <ul className='flex flex-wrap'>
              {(question.tags ?? []).map((tag, index) => (
                <li
                  key={index}
                  className=' mr-2 flex align-middle bg-title p-1 pl-2 rounded-xl text-white'
                >
                  {tag}
                  <button
                    type='button'
                    onClick={() => handleRemove(index)}
                    className='text-red-500 hover:text-red-700 text-[.7rem] font-bold px-1'
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Label
              htmlFor={`question-type-${questionIndex}`}
              className='block text-sm font-semibold'
            >
              Question Type
            </Label>
            <select
              id={`question-type-${questionIndex}`}
              value={question.type}
              onChange={(e) => handleTypeChange(Number(e.target.value))}
              className='block w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-r-[16px] border-transparent'
            >
              {questionTypes.map(({ title, value }) => (
                <option key={value} value={value}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-3'>
            <Label className='block text-sm font-semibold'>
              {question.type === 2 ? 'Likert Scale Options' : 'Answer Options'}
            </Label>

            {(question.surveyOptions?.length ?? 0) === 0 ? (
              <div>
                <p className='text-gray-500 italic text-sm'>
                  No options added yet. Click "Add Option" below.
                </p>
                <span className='text-red text-[.8rem]'>
                  (At least one option is required)
                </span>
              </div>
            ) : (
              question.surveyOptions.map((option, optionIndex) => (
                <div key={optionIndex} className='flex items-center gap-2'>
                  <div className='flex-grow'>
                    <Label
                      htmlFor={`option-${questionIndex}-${optionIndex}`}
                      className='block text-sm font-semibold'
                    >
                      Option {optionIndex + 1}{' '}
                      {!option && (
                        <span className='text-red text-[.8rem]'>
                          (required)
                        </span>
                      )}
                    </Label>
                    <Input
                      id={`option-${questionIndex}-${optionIndex}`}
                      type='text'
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(optionIndex, e.target.value)
                      }
                      placeholder={`Enter option text`}
                      className={`block w-full p-3 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !option
                          ? 'border-red-500 ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                  </div>

                  <Button
                    type='button'
                    onClick={() => removeOption(optionIndex)}
                    variant='ghost'
                    className='mt-6 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8'
                    title='Remove Option'
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}

            <Button
              type='button'
              onClick={addOption}
              variant='outline'
              className='text-blue-500 hover:bg-blue-50 mt-2 flex items-center gap-1'
            >
              <Plus size={16} />
              Add Option
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
