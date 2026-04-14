import css from './NoteForm.module.css';
import { useId } from 'react';
import { type Note, NoteTag } from '../../types/note';
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title is too long'),
  content: Yup.string().max(500, 'Content is too long'),
  tag: Yup.mixed<NoteTag>()
    .oneOf(Object.values(NoteTag))
    .required('Tag is required'),
});

interface NoteFormProps {
  onCancel: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: NoteTag.Todo,
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleCreateNote = async (noteData: Note) => {
    createNoteMutation.mutate(noteData);
  };

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>,
  ) => {
    handleCreateNote(values as Note);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`title-${fieldId}`}>Title</label>
          <Field
            id={`title-${fieldId}`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`content-${fieldId}`}>Content</label>
          <Field
            id={`content-${fieldId}`}
            name="content"
            as="textarea"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`tag-${fieldId}`}>Tag</label>
          <Field
            as="select"
            id={`tag-${fieldId}`}
            name="tag"
            className={css.select}
          >
            <option value={NoteTag.Todo}>Todo</option>
            <option value={NoteTag.Work}>Work</option>
            <option value={NoteTag.Personal}>Personal</option>
            <option value={NoteTag.Meeting}>Meeting</option>
            <option value={NoteTag.Shopping}>Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
