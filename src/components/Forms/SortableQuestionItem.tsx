import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { SurveyQuestion } from '@/types';
import QuestionItem from './QuestionItem';

interface SortableQuestionItemProps {
  question: SurveyQuestion;
  questionIndex: number;
  onChange: (question: SurveyQuestion) => void;
  onRemove: () => void;
}

const SortableQuestionItem = ({
  question,
  questionIndex,
  onChange,
  onRemove,
}: SortableQuestionItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.questionId! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'z-50 shadow-lg' : ''}`}
    >
      {/* Drag Handle */}
      <div
        className='absolute left-2 top-4 z-10 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors group'
        {...attributes}
        {...listeners}
        title='Drag to reorder'
      >
        <GripVertical className='h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors' />
      </div>

      {/* Question Item with adjusted padding to accommodate drag handle */}
      <div className='pl-10'>
        <QuestionItem
          question={question}
          questionIndex={questionIndex}
          onChange={onChange}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
};

export default SortableQuestionItem;
