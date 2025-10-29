/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useCreateCompanySurveyMutation,
  useGetAllCompaniesQuery,
  useGetDepartmentSurveyQuery,
  useUpdateCompanySurveyMutation,
} from '@/api/apiSlice';
import { SurveyTypes } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeleteCompanySurveyMutation } from '@/api/apiSlice';
import CompanyDepartmentSelector from '@/components/Forms/CompanyDepartmentSelector';
import SurveyForm from '@/components/Forms/SurveyForm';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const SurveyManager = () => {
  const { data: companies, isLoading, isError } = useGetAllCompaniesQuery();
  const [isConfirmDeleteSurvey, setIsConfirmDeleteSurvey] = useState(false);
  const [isSurveyCreated, setIsSurveyCreated] = useState(false);

  const [selection, setSelection] = useState({
    companyId: '',
    departmentId: '',
  });

  const [
    deleteCompanySurvey,
    { isLoading: isDeleting, isError: isDeleteError },
  ] = useDeleteCompanySurveyMutation();

  const questionTypeMap: Record<string, number> = {
    SingleChoice: 0,
    MultipleChoice: 1,
    LikertScale: 2,
    Scale0To10: 3,
  };

  const normalizeSurvey = (raw: any): SurveyTypes => ({
    id: raw.id,
    surveyId: raw.surveyId,
    companyId: raw.companyId,
    departmentId: raw.departmentId,
    title: raw.title,
    description: raw.description,
    consentRequired: raw.consentRequired ?? true,
    surveyPublished: raw.surveyPublished ?? raw.publishSurvey ?? false,
    questions:
      raw.questions?.map((q: any) => ({
        questionId: q.questionId,
        questionText: q.questionText,
        questionSubtext: q.questionSubText || q.questionSubtext || '',
        type: questionTypeMap[q.type] ?? 0,
        tags: q.tags || [],
        surveyOptions: q.surveyOptions,
        isSkippable: q.isSkippable ?? true,
        metricKey: q.metricKey || [],
        metricType: q.metricType || [],
        prefix: q.prefix ?? 'Over the last week',
      })) || [],
  });

  // Fetch existing survey(s) for chosen company & department
  const {
    data: companySurvey,
    isLoading: surveyLoading,
    isError: surveyError,
    refetch: refetchCompanySurvey,
  } = useGetDepartmentSurveyQuery(
    {
      companyId: selection.companyId,
      departmentId: selection.departmentId,
    },
    {
      skip: !selection.companyId || !selection.departmentId,
      // Force refetch to always get fresh data
      refetchOnMountOrArgChange: true,
    }
  );

  // Check if the query is active (not skipped)
  const isQueryActive = selection.companyId && selection.departmentId;

  const [
    createCompanySurvey,
    { isLoading: isCreating, isError: isCreateError },
  ] = useCreateCompanySurveyMutation();
  const [
    updateCompanySurvey,
    { isLoading: isUpdating, isError: isUpdateError },
  ] = useUpdateCompanySurveyMutation();

  const [surveyData, setSurveyData] = useState<{
    survey: SurveyTypes | null;
    existingSurvey: SurveyTypes | null;
    isDirty: boolean;
  }>({
    survey: null,
    existingSurvey: null,
    isDirty: false,
  });

  // Force refetch when component mounts with both company and department selected
  useEffect(() => {
    if (selection.companyId && selection.departmentId && isQueryActive) {
      refetchCompanySurvey();
    }
  }, []); // Only run on mount

  useEffect(() => {
    const { companyId, departmentId } = selection;
    if (!companyId || !departmentId) {
      setSurveyData({ survey: null, existingSurvey: null, isDirty: false });
      return;
    }

    if (companySurvey) {
      const existing = normalizeSurvey(companySurvey);
      setSurveyData({
        existingSurvey: existing,
        survey: JSON.parse(JSON.stringify(existing)),
        isDirty: false,
      });
    } else {
      const newSurvey: SurveyTypes = {
        id: '',
        surveyId: '',
        companyId,
        departmentId,
        title: '',
        description: '',
        consentRequired: true,
        surveyPublished: false,
        questions: [],
      };

      setSurveyData({
        existingSurvey: null,
        survey: newSurvey,
        isDirty: false,
      });
    }
  }, [companySurvey, selection]);

  // Handle selection changes
  const handleSelectionChange = (
    field: 'companyId' | 'departmentId',
    value: string
  ) => {
    if (field === 'companyId' && value !== selection.companyId) {
      // Reset survey state when company changes
      setSurveyData({ survey: null, existingSurvey: null, isDirty: false });
      setSelection({ companyId: value, departmentId: '' });
    } else if (field === 'departmentId' && value !== selection.departmentId) {
      // Reset survey state and force refetch when department changes
      setSurveyData({ survey: null, existingSurvey: null, isDirty: false });
      setSelection({ ...selection, [field]: value });
      // Force refetch the survey data for the new department
      // Only refetch if both companyId and departmentId are available
      if (value && selection.companyId && isQueryActive) {
        refetchCompanySurvey();
      }
    } else {
      setSelection({ ...selection, [field]: value });
    }
  };

  // Propagate form edits
  const handleSurveyUpdate = (updatedSurvey: SurveyTypes) => {
    setSurveyData((prev) => ({
      ...prev,
      survey: updatedSurvey,
      isDirty: true,
    }));
  };

  // Reset to last saved
  const handleResetSurvey = () => {
    if (surveyData.existingSurvey) {
      setSurveyData((prev) => ({
        ...prev,
        survey: JSON.parse(JSON.stringify(prev.existingSurvey!)),
        isDirty: false,
      }));
    }
  };

  // Submit (create/update)
  const handleSubmitSurvey = async () => {
    if (!surveyData.survey) return;
    try {
      let savedSurvey;
      if (surveyData.existingSurvey) {
        // Ensure we preserve the publish state when updating
        const surveyToUpdate = {
          ...surveyData.survey,
          // Make sure we send the correct field name for the API
          publishSurvey: surveyData.survey.surveyPublished,
        };

        savedSurvey = await updateCompanySurvey({
          id: surveyData.survey.id,
          survey: surveyToUpdate,
        }).unwrap();
      } else {
        savedSurvey = await createCompanySurvey(surveyData.survey).unwrap();

        setIsSurveyCreated(true);
        setTimeout(() => setIsSurveyCreated(false), 3000);
      }

      const normalized = normalizeSurvey(savedSurvey);

      // Use the response from the API call directly instead of refetching
      // to avoid race conditions where the server hasn't updated yet
      setSurveyData({
        existingSurvey: normalized,
        survey: JSON.parse(JSON.stringify(normalized)),
        isDirty: false,
      });
    } catch (error) {
      console.error('Failed to submit survey:', error);
    }
  };

  const handleDeleteSurvey = async () => {
    if (!surveyData.existingSurvey?.id) return;
    try {
      await deleteCompanySurvey({ id: surveyData.existingSurvey.id }).unwrap();

      // Clear the survey data immediately after successful deletion
      // No need to refetch since we're clearing the data anyway
      setSurveyData({
        existingSurvey: null,
        survey: null,
        isDirty: false,
      });
    } catch (error) {
      console.error('Failed to delete survey:', error);
    }
  };

  if (isLoading || surveyLoading) return <p>Loading company survey data...</p>;
  if (isError || surveyError) return <p>Error loading survey data</p>;

  return (
    <>
      <h2 className='text-title-lg font-semibold text-title my-2'>
        Survey Manager
      </h2>
      <Card>
        <CardHeader>
          <CardTitle className='text-title'>Create or Update Survey</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyDepartmentSelector
            companies={companies || []}
            selection={selection}
            onSelectionChange={handleSelectionChange}
          />
          {surveyData.existingSurvey && (
            <Button
              variant='destructive'
              className='mt-4 mb-4'
              onClick={() => setIsConfirmDeleteSurvey(true)}
              disabled={isDeleting}
            >
              Delete Survey
            </Button>
          )}
          {isDeleteError && (
            <p className='text-sm text-red-500'>Failed to delete the survey.</p>
          )}
          {surveyData.survey && (
            <SurveyForm
              survey={surveyData.survey}
              isExisting={!!surveyData.existingSurvey}
              isDirty={surveyData.isDirty}
              onSurveyChange={handleSurveyUpdate}
              onReset={handleResetSurvey}
              onSubmit={handleSubmitSurvey}
            />
          )}
          {(isCreating || isUpdating || isLoading) && (
            <p className='text-sm text-blue-500'>Submitting...</p>
          )}

          {(isCreateError || isUpdateError) && (
            <p className='text-sm text-red-500'>
              Something went wrong updating the survey
            </p>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={isConfirmDeleteSurvey}
        onOpenChange={setIsConfirmDeleteSurvey}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Survey?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently
              delete this survey?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsConfirmDeleteSurvey(false)}
            >
              Cancel
            </Button>
            <Button
              className='bg-red-600 text-white hover:bg-red-700'
              onClick={async () => {
                setIsConfirmDeleteSurvey(false);
                await handleDeleteSurvey();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isSurveyCreated} onOpenChange={setIsSurveyCreated}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Survey Created!</DialogTitle>
            <DialogDescription>
              Your new survey has been successfully created.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsSurveyCreated(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SurveyManager;
