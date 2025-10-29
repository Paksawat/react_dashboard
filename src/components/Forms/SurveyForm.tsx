import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { SurveyTypes } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuestionList from './QuestionList';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  Play,
  Square,
} from 'lucide-react';
import {
  usePublishCompanySurveyMutation,
  useEndCompanySurveyMutation,
} from '@/api/apiSlice';

interface SurveyFormProps {
  survey: SurveyTypes;
  isExisting: boolean;
  isDirty: boolean;
  onSurveyChange: (survey: SurveyTypes) => void;
  onReset: () => void;
  onSubmit: () => void;
}

const SurveyForm = ({
  survey,
  isExisting,
  isDirty,
  onSurveyChange,
  onReset,
  onSubmit,
}: SurveyFormProps) => {
  const [surveyActive, setSurveyActive] = useState(
    survey.surveyPublished ?? false
  );

  // Sync surveyActive state with survey.surveyPublished when survey prop changes
  useEffect(() => {
    setSurveyActive(survey.surveyPublished ?? false);
  }, [survey.surveyPublished]);

  const [isConfirmActivateSurvey, setIsConfirmActivateSurvey] = useState(false);
  const [isConfirmUpdateSurvey, setIsConfirmUpdateSurvey] = useState(false);
  const [isConfirmResetSurvey, setIsConfirmResetSurvey] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [publishCompanySurvey, { isLoading: isUpdating, error: publishError }] =
    usePublishCompanySurveyMutation();
  const [endCompanySurvey, { isLoading: isEnding, error: endError }] =
    useEndCompanySurveyMutation();

  // Handle basic field changes
  const handleFieldChange = <K extends keyof SurveyTypes>(
    field: K,
    value: SurveyTypes[K]
  ) => {
    onSurveyChange({ ...survey, [field]: value });
  };

  // Enhanced validation with detailed error messages - memoized to prevent infinite re-renders
  const { validationErrors, isSurveyValid } = useMemo(() => {
    const errors: string[] = [];

    if (!survey.title || survey.title.trim() === '') {
      errors.push('Survey title is required');
    }
    if (!survey.description || survey.description.trim() === '') {
      errors.push('Survey description is required');
    }
    if (!survey.questions || survey.questions.length === 0) {
      errors.push('At least one question is required');
    }

    survey.questions?.forEach((question, index) => {
      if (!question.questionText || question.questionText.trim() === '') {
        errors.push(`Question ${index + 1}: Question text is required`);
      }

      if (question.type !== 2 && question.type !== 3) {
        if (!question.surveyOptions || question.surveyOptions.length === 0) {
          errors.push(`Question ${index + 1}: At least one option is required`);
        } else if (question.surveyOptions.some((opt) => opt.trim() === '')) {
          errors.push(`Question ${index + 1}: All options must have text`);
        }
      }
    });

    return {
      validationErrors: errors,
      isSurveyValid: errors.length === 0,
    };
  }, [survey.title, survey.description, survey.questions]);

  // Handle text input change

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof SurveyTypes
  ) => {
    handleFieldChange(field, e.target.value);
  };
  // Handle survey reset with confirmation
  const handleResetClick = () => {
    setIsConfirmResetSurvey(true);
  };

  const confirmReset = () => {
    onReset();
    setIsConfirmResetSurvey(false);
  };

  const handleSetSurveyEnd = async () => {
    try {
      await endCompanySurvey({
        surveyId: survey.surveyId,
        departmentId: survey.departmentId,
      }).unwrap();
      setSurveyActive(false); // survey is now closed
      setIsConfirmActivateSurvey(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      // Update the survey state locally instead of refetching
      // to avoid race conditions where server data isn't updated yet
      onSurveyChange({ ...survey, surveyPublished: false });
    } catch (err) {
      console.error('Failed to end survey:', err);
    }
  };

  const blockIfInvalid = () => {
    if (!isSurveyValid) {
      setIsConfirmActivateSurvey(false);
      return true; // tell the caller we bailed out
    }
    return false;
  };
  const handleSetSurveyActive = async () => {
    if (blockIfInvalid()) return;
    try {
      await publishCompanySurvey({ id: survey.id }).unwrap();
      setSurveyActive(true);
      setIsConfirmActivateSurvey(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      // Update the survey state locally instead of refetching
      // to avoid race conditions where server data isn't updated yet
      onSurveyChange({ ...survey, surveyPublished: true });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      {/* Success Message */}
      {showSuccessMessage && (
        <Alert className='mb-4 border-green-200 bg-green-50'>
          <CheckCircle2 className='h-4 w-4 text-green-600' />
          <AlertDescription className='text-green-800'>
            Survey {surveyActive ? 'activated' : 'ended'} successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Messages */}
      {(publishError || endError) && (
        <Alert variant='destructive' className='mb-4'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            {publishError ? 'Failed to publish survey' : 'Failed to end survey'}
            . Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant='destructive' className='mb-4'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            <div className='space-y-1'>
              <p className='font-medium'>Please fix the following issues:</p>
              <ul className='list-disc list-inside space-y-1'>
                {validationErrors.map((error, index) => (
                  <li key={index} className='text-sm'>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className='space-y-8 p-8 bg-white border border-gray-200 rounded-xl shadow-sm'>
        <div className='space-y-6'>
          {/* Survey Status Section */}
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center space-x-3'>
                {surveyActive ? (
                  <Play className='h-5 w-5 text-green-600' />
                ) : (
                  <Square className='h-5 w-5 text-gray-400' />
                )}
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Survey Status
                  </h3>
                  <div className='flex items-center space-x-2 mt-1'>
                    <Badge
                      variant={surveyActive ? 'default' : 'secondary'}
                      className='text-xs text-white'
                    >
                      {surveyActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {surveyActive && (
                      <Badge
                        variant='outline'
                        className='text-xs text-green-600 border-green-200'
                      >
                        Live
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                {surveyActive ? (
                  <Button
                    onClick={() => setIsConfirmActivateSurvey(true)}
                    disabled={isUpdating || isEnding}
                    variant='destructive'
                    size='sm'
                    className='flex items-center space-x-2'
                  >
                    {isEnding ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Square className='h-4 w-4' />
                    )}
                    <span>{isEnding ? 'Ending...' : 'End Survey'}</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsConfirmActivateSurvey(true)}
                    disabled={isUpdating || isEnding}
                    className='flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white'
                    size='sm'
                  >
                    {isUpdating ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Play className='h-4 w-4' />
                    )}
                    <span>{isUpdating ? 'Starting...' : 'Start Survey'}</span>
                  </Button>
                )}
              </div>
            </div>

            <div className='text-sm text-gray-600'>
              {surveyActive ? (
                <div className='flex items-start space-x-2'>
                  <Info className='h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0' />
                  <p>
                    Survey is currently active and available to users. End the
                    survey to close it for new responses and begin data
                    processing.
                  </p>
                </div>
              ) : (
                <div className='flex items-start space-x-2'>
                  <Info className='h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0' />
                  <p>
                    When activated, this survey will be available to users in
                    the department every Thursday. Make sure all questions are
                    complete before activating.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Dialog
            open={isConfirmActivateSurvey}
            onOpenChange={setIsConfirmActivateSurvey}
          >
            {surveyActive ? (
              <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                  <DialogTitle className='flex items-center space-x-2'>
                    <Square className='h-5 w-5 text-red-500' />
                    <span>End Survey?</span>
                  </DialogTitle>
                  <DialogDescription className='text-gray-600'>
                    This will close the survey for new responses and begin data
                    processing. Users who have already started the survey will
                    be able to complete it, but no new users can begin.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className='flex-col sm:flex-row gap-2'>
                  <Button
                    variant='outline'
                    onClick={() => setIsConfirmActivateSurvey(false)}
                    className='w-full sm:w-auto'
                  >
                    Keep Active
                  </Button>
                  <Button
                    onClick={handleSetSurveyEnd}
                    disabled={isEnding}
                    variant='destructive'
                    className='w-full sm:w-auto'
                  >
                    {isEnding ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Ending...
                      </>
                    ) : (
                      'End Survey'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            ) : (
              <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                  <DialogTitle className='flex items-center space-x-2'>
                    <Play className='h-5 w-5 text-green-500' />
                    <span>Activate Survey?</span>
                  </DialogTitle>
                  <DialogDescription className='text-gray-600'>
                    This will make the survey available to users in the
                    department every Thursday. Make sure all questions are
                    complete and valid before activating.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className='flex-col sm:flex-row gap-2'>
                  <Button
                    variant='outline'
                    onClick={() => setIsConfirmActivateSurvey(false)}
                    className='w-full sm:w-auto'
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSetSurveyActive}
                    disabled={isUpdating}
                    className='w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white'
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Activating...
                      </>
                    ) : (
                      'Activate Survey'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            )}
          </Dialog>
          {/* Consent Section */}
          <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Label
                  htmlFor='consent'
                  className='text-sm font-semibold text-gray-900'
                >
                  User Consent
                </Label>
                <p className='text-sm text-gray-600 mt-1'>
                  Require users to provide consent before participating
                </p>
              </div>
              <Switch
                id='consent'
                checked={survey.consentRequired ?? true}
                onCheckedChange={(checked) =>
                  handleFieldChange('consentRequired', checked)
                }
                aria-label='Require user consent'
              />
            </div>
          </div>

          {/* Survey Basic Information Card */}
          <Card className='border border-gray-200 shadow-sm bg-white'>
            <CardHeader className='pb-4 border-b border-gray-100'>
              <CardTitle className='text-lg font-semibold text-gray-900 flex items-center'>
                Survey Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6 pt-6'>
              {/* Survey Title */}
              <div className='space-y-2'>
                <Label
                  htmlFor='survey-title'
                  className='text-sm font-semibold text-gray-900'
                >
                  Survey Title{' '}
                  <span className='text-red-500 text-sm font-normal'>
                    (required)
                  </span>
                </Label>
                <Input
                  id='survey-title'
                  type='text'
                  value={survey.title}
                  onChange={(e) => handleInputChange(e, 'title')}
                  placeholder='Enter a descriptive title for your survey'
                  className='w-full'
                  required
                  aria-describedby='title-help'
                />
                <p id='title-help' className='text-xs text-gray-500'>
                  Choose a clear, descriptive title that explains the purpose of
                  your survey
                </p>
              </div>

              {/* Survey Description */}
              <div className='space-y-2'>
                <Label
                  htmlFor='survey-description'
                  className='text-sm font-semibold text-gray-900'
                >
                  Survey Description{' '}
                  <span className='text-red-500 text-sm font-normal'>
                    (required)
                  </span>
                </Label>
                <textarea
                  id='survey-description'
                  value={survey.description}
                  onChange={(e) => handleInputChange(e, 'description')}
                  placeholder='Provide a detailed description of what this survey is about and what you hope to learn'
                  rows={4}
                  className='w-full resize-none border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-400'
                  required
                  aria-describedby='description-help'
                />
                <p id='description-help' className='text-xs text-gray-500'>
                  Explain the purpose, scope, and expected outcomes of this
                  survey
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <QuestionList
          questions={survey.questions}
          onChange={(updatedQuestions) => {
            onSurveyChange({ ...survey, questions: updatedQuestions });
          }}
        />

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200'>
          {isExisting ? (
            <>
              <Button
                onClick={() => {
                  if (surveyActive) {
                    setIsConfirmUpdateSurvey(true);
                  } else {
                    onSubmit();
                  }
                }}
                disabled={!isDirty || !isSurveyValid}
                className='flex-1 sm:flex-none text-white'
                size='lg'
              >
                {!isDirty && !isSurveyValid ? (
                  <>
                    <AlertCircle className='mr-2 h-4 w-4' />
                    Fix Issues to Update
                  </>
                ) : !isDirty ? (
                  'No Changes to Save'
                ) : (
                  'Update Survey'
                )}
              </Button>
              <Dialog
                open={isConfirmUpdateSurvey}
                onOpenChange={setIsConfirmUpdateSurvey}
              >
                <DialogContent className='sm:max-w-md'>
                  <DialogHeader>
                    <DialogTitle className='flex items-center space-x-2'>
                      <AlertCircle className='h-5 w-5 text-amber-500' />
                      <span>Update Active Survey?</span>
                    </DialogTitle>
                    <DialogDescription className='text-gray-600'>
                      This survey is currently active and users may be
                      responding to it. Changes could affect their experience or
                      data integrity. Consider the impact before proceeding.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className='flex-col sm:flex-row gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => setIsConfirmUpdateSurvey(false)}
                      className='w-full sm:w-auto'
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setIsConfirmUpdateSurvey(false);
                        onSubmit();
                      }}
                      className='w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white'
                    >
                      Update Anyway
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {isDirty && (
                <Button
                  onClick={handleResetClick}
                  variant='outline'
                  className='flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50'
                  size='lg'
                >
                  Cancel Changes
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={!isSurveyValid}
              className='w-full sm:w-auto'
              size='lg'
            >
              {!isSurveyValid ? (
                <>
                  <AlertCircle className='mr-2 h-4 w-4' />
                  Complete Required Fields
                </>
              ) : (
                'Create Survey'
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={isConfirmResetSurvey}
        onOpenChange={setIsConfirmResetSurvey}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center space-x-2'>
              <AlertCircle className='h-5 w-5 text-red-500' />
              <span>Discard Changes?</span>
            </DialogTitle>
            <DialogDescription className='text-gray-600'>
              This will revert all unsaved changes you've made to this survey.
              This action cannot be undone and you'll lose all your recent
              edits.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex-col sm:flex-row gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsConfirmResetSurvey(false)}
              className='w-full sm:w-auto'
            >
              Keep Editing
            </Button>
            <Button
              onClick={confirmReset}
              variant='destructive'
              className='w-full sm:w-auto'
            >
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SurveyForm;
