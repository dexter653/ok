import { FormSubmission } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { generateId } from '../utils/helpers';

export function useFormSubmissions() {
  const [submissions, setSubmissions] = useLocalStorage<FormSubmission[]>('form-submissions', []);

  const submitForm = (templateId: string, data: Record<string, any>): FormSubmission => {
    const submission: FormSubmission = {
      id: generateId(),
      templateId,
      data,
      submittedAt: new Date(),
    };

    setSubmissions([...submissions, submission]);
    return submission;
  };

  const getSubmissionsByTemplate = (templateId: string) => {
    return submissions.filter(submission => submission.templateId === templateId);
  };

  const deleteSubmission = (submissionId: string) => {
    setSubmissions(submissions.filter(submission => submission.id !== submissionId));
  };

  return {
    submissions,
    submitForm,
    getSubmissionsByTemplate,
    deleteSubmission,
  };
}