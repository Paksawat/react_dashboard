import { SurveyQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableQuestionItem from './SortableQuestionItem';

interface QuestionListProps {
  questions?: SurveyQuestion[]; // optional, with default
  onChange: (questions: SurveyQuestion[]) => void;
}

const QuestionList = ({ questions = [], onChange }: QuestionListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Ensure all questions have unique IDs
  const questionsWithIds = questions.map((question, index) => ({
    ...question,
    questionId:
      question.questionId ||
      `question-${Date.now()}-${index}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
  }));

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      questionText: '',
      questionSubtext: '',
      type: 0,
      tags: [],
      surveyOptions: [],
      metricKey: [],
      metricType: [],
      isSkippable: true,
      prefix: 'Over the last week',
      // Add a unique ID for drag-and-drop
      questionId: `question-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
    };
    onChange([...questionsWithIds, newQuestion]);
  };

  const updateQuestion = (index: number, updatedQuestion: SurveyQuestion) => {
    const newQuestions = [...questionsWithIds];
    newQuestions[index] = {
      ...updatedQuestion,
      questionId: questionsWithIds[index].questionId,
    };
    onChange(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questionsWithIds];
    newQuestions.splice(index, 1);
    onChange(newQuestions);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questionsWithIds.findIndex(
        (question) => question.questionId === active.id
      );
      const newIndex = questionsWithIds.findIndex(
        (question) => question.questionId === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedQuestions = arrayMove(
          questionsWithIds,
          oldIndex,
          newIndex
        );
        onChange(reorderedQuestions);
      }
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-medium text-lg'>Survey Questions</h3>
        {questionsWithIds.length > 1 && (
          <p className='text-sm text-gray-500'>
            Drag the grip handle to reorder questions
          </p>
        )}
      </div>

      {questionsWithIds?.length === 0 ? (
        <div>
          <p className='text-gray-500 italic'>
            No questions added yet. Click below to add your first question.
          </p>
          <span className='text-red text-[.8rem]'>
            (At least one question is required)
          </span>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questionsWithIds.map((question) => question.questionId!)}
            strategy={verticalListSortingStrategy}
          >
            <div className='space-y-4'>
              {questionsWithIds?.map((question, index) => (
                <SortableQuestionItem
                  key={question.questionId}
                  question={question}
                  questionIndex={index}
                  onChange={(q) => updateQuestion(index, q)}
                  onRemove={() => removeQuestion(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Button
        type='button'
        onClick={addQuestion}
        className='bg-blue-500 hover:bg-blue-600 text-white'
      >
        Add Question
      </Button>
    </div>
  );
};

export default QuestionList;
