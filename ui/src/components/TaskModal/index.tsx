import { FC, FormEvent, useRef, useCallback, MouseEvent } from 'react';
import { Button, Input } from '..';
import { Close } from '../../icons';
import { motion } from 'framer-motion';
import { useOnClickOutside } from '../../hooks';
import { ApiError, Task } from '../../types';
import { useForm, SubmitHandler } from 'react-hook-form';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onReset: () => void;
  onChangeSelectedTaskFilePath: () => void;
  apiError: ApiError | null;
  selectedTask: Task | null;
  isLoading: boolean;
};

type Inputs = {
  title: string;
  description: string;
  file?: FileList;
};

export const TaskModal: FC<Props> = ({
  isOpen,
  onClose,
  onReset,
  onSubmit,
  onChangeSelectedTaskFilePath,
  apiError,
  isLoading,
  selectedTask,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      title: selectedTask?.title ?? '',
      description: selectedTask?.description ?? '',
      file: undefined,
    },
  });

  const modalRef = useRef<HTMLFormElement | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const onResetForm = useCallback(() => {
    onReset();
    clearErrors();
    reset();

    if (inputFileRef?.current && 'value' in inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  }, [clearErrors, onReset, reset]);

  const onCloseModal = useCallback((event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault?.();

    onClose();
    onResetForm();
  }, [onResetForm, onClose]);

  useOnClickOutside(modalRef, ({ isClickedOutside }) => {
    if (isClickedOutside && isOpen && !isLoading) {
      onCloseModal();
    }
  });

  const onHandleSubmit: SubmitHandler<Inputs> = (_, event) => {
    onSubmit(event as FormEvent<HTMLFormElement>);

    if (!selectedTask) {
      onReset();
      reset();
    }

    clearErrors();
  };

  return (
    <motion.dialog
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="z-50 fixed inset-0 bg-black bg-opacity-25 h-screen w-screen backdrop-blur-sm flex justify-center items-center p-5"
    >
      <motion.form
        ref={modalRef}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        exit={{ y: 20 }}
        className="bg-white relative p-8 rounded-md shadow-lg flex flex-col gap-12 w-[550px]"
        onSubmit={handleSubmit(onHandleSubmit)}
        onReset={onResetForm}
      >
        <div className="flex flex-col gap-5">
          <Input
            label="Title"
            placeholder="Enter a title..."
            errorMessage={errors.title?.message || apiError?.errors?.title}
            {...register('title', {
              required: 'Title cannot be empty',
            })}
          />

          <Input
            label="Description"
            placeholder="Enter a description..."
            errorMessage={
              errors.description?.message || apiError?.errors?.description
            }
            {...register('description', {
              required: 'Description cannot be empty',
            })}
          />

          <Input
            label="File"
            type="file"
            onResetValue={onChangeSelectedTaskFilePath}
            errorMessage={errors.file?.message || apiError?.errors?.file}
            additionalRef={inputFileRef}
            defaultValue={selectedTask?.filePath ?? ''}
            {...register('file', {
              validate: {
                acceptedFormats: (files) => {
                  const fileType = files?.[0]?.type;

                  if (!fileType) {
                    return true;
                  }

                  const acceptedTypes = [
                    'text/plain', // .txt
                    'application/pdf', // .pdf
                    'application/msword', // .doc
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                    'image/png', // .png
                    'image/jpeg', // .jpg, .jpeg
                  ];

                  return (
                    acceptedTypes.includes(fileType) ||
                    'Only .txt, .pdf, .doc, .docx, .png, .jpg, .jpeg accepted'
                  );
                },
              },
            })}
          />
        </div>

        <div className="flex gap-4">
          <Button isPending={isLoading} className="grow">
            {selectedTask ? 'Save' : 'Create'}
          </Button>

          <Button
            disabled={isLoading}
            type="reset"
            variant="secondary"
            className="grow"
          >
            Cancel
          </Button>
        </div>

        <Button
          disabled={isLoading}
          onClick={onCloseModal}
          variant="accent"
          className="absolute top-2 right-2"
        >
          <Close />
        </Button>
      </motion.form>
    </motion.dialog>
  );
};
