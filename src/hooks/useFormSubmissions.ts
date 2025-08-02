import { FormSubmission } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { generateId } from '../utils/helpers';

export function useFormSubmissions() {
  const [submissions, setSubmissions] = useLocalStorage<FormSubmission[]>('form-submissions', []);

  const submitForm = (templateId: string, data: Record<string, any>): FormSubmission => {
    // Validate that we have some data to submit
    if (!data || Object.keys(data).length === 0) {
      throw new Error('No data to submit');
    }

    const submission: FormSubmission = {
      id: generateId(),
      templateId,
      data,
      submittedAt: new Date(),
    };

    setSubmissions(prev => [...prev, submission]);
    return submission;
  };

  const getSubmissionsByTemplate = (templateId: string) => {
    return submissions.filter(submission => submission.templateId === templateId);
  };

  const deleteSubmission = (submissionId: string) => {
    setSubmissions(prev => prev.filter(submission => submission.id !== submissionId));
  };

  const getAllSubmissions = () => {
    return submissions;
  };

  return {
    submissions,
    submitForm,
    getSubmissionsByTemplate,
    deleteSubmission,
    getAllSubmissions,
  };
}