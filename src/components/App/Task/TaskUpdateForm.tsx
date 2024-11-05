import React, { FC } from 'react';
import { RefinementCtx, z } from 'zod';
import { useForm } from 'react-hook-form';
import { TaskDetail, TaskPriority, TaskStatus } from '../../../types/graphql';
import { User } from '../../../types/redux';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COMPANY_USERS, GET_TASK } from '../../../graphql/queries';
import { CREATE_TASK } from '../../../graphql/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormError,
  InputField,
  SelectEnumField,
  SelectUserField,
  SubmitButton,
  TextAreaField,
} from '../../Auth/FormComponents';
import { UPDATE_TASK } from '../../../graphql/mutations/Tasks/TaskUpdate';
const TaskSchema = (defaultDueDate: string) =>
  z.object({
    title: z
      .string()
      .min(3, 'Project name must be at least 3 characters')
      .max(100, 'Project name must be less than 100 characters'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description must be less than 1000 characters'),
    assignee: z.string().min(1, 'Project manager selection is required'),
    status: z.nativeEnum(TaskStatus), // TaskStatus enum'unu Zod şemasında kullanma
    priority: z.nativeEnum(TaskPriority), // TaskPriority enum'unu Zod şemasında kullanma
    dueDate: z
      .string()
      .min(1, 'Start date is required')
      .refine(
        (date) => {
          const parsedDate = new Date(date);
          if (defaultDueDate == date) {
            return true;
          }
          if (parsedDate >= new Date()) {
            return false;
          }
        },
        {
          message: 'Start date must be in the future',
        }
      ),
  });

type TaskFormData = z.infer<ReturnType<typeof TaskSchema>>;
interface GetCompanyUsersQueryResult {
  getCompanyUsers: User[];
}

interface TaskUpdateFormProps {
  taskData: TaskDetail;
}
const TaskUpdateForm: FC<TaskUpdateFormProps> = ({ taskData }) => {
  const { data: usersData, loading: usersLoading } =
    useQuery<GetCompanyUsersQueryResult>(GET_COMPANY_USERS);

  const [updateTask, { loading: mutationLoading }] = useMutation(UPDATE_TASK, {
    refetchQueries: [
      {
        query: GET_TASK,
        variables: { taskId: taskData._id },
      },
    ],

    onError: (error) => {
      console.error('Error creating project:', error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(
      TaskSchema(new Date(+taskData.dueDate).toLocaleDateString('en-CA'))
    ),
    defaultValues: {
      title: taskData.title,
      description: taskData.description,
      assignee: taskData.assignee._id,
      dueDate: new Date(+taskData.dueDate).toLocaleDateString('en-CA'),
      priority: taskData.priority,
      status: taskData.status,
    },
  });
  const onSubmit = async (data: TaskFormData) => {


    try {
      await updateTask({
        variables: {
          input: {
            taskId: taskData._id,
            ...data,
            dueDate: new Date(data.dueDate).toLocaleDateString('tr-TR'),
          },
        },
      });
      // reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  if (usersLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading users...
      </div>
    );
  }
  if (!usersData) {
    return <div>users is null</div>;
  }

  const isFormValid =
    watch('title') !== taskData.title ||
    watch('description') !== taskData.description ||
    watch('assignee') !== taskData.assignee._id ||
    watch('status') !== taskData.status ||
    watch('priority') !== taskData.priority ||
    watch('dueDate') !==
      new Date(+taskData.dueDate).toLocaleDateString('en-CA');
  const users = usersData?.getCompanyUsers;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Task Title "
          name="title"
          type="title"
          placeholder="task"
          register={register}
          error={errors.title?.message}
        />
        <TextAreaField
          label="Task Description "
          name="description"
          rows={4}
          placeholder="project description"
          register={register}
          error={errors.description?.message}
        ></TextAreaField>

        <SelectUserField
          label="Task Assignee"
          name="assignee"
          size={1}
          register={register}
          error={errors.assignee?.message}
          multiple={false}
          users={users}
        ></SelectUserField>
        <div className="grid md:grid-cols-2 grid-cols-1">
          <SelectEnumField
            label="Task status"
            name="status"
            size={1}
            register={register}
            error={errors.status?.message}
            multiple={false}
            options={TaskStatus}
          ></SelectEnumField>

          <SelectEnumField
            label="Task priority"
            name="priority"
            size={1}
            register={register}
            error={errors.priority?.message}
            multiple={false}
            options={TaskPriority}
          ></SelectEnumField>
        </div>
        <InputField
          label=" Due Date "
          name="dueDate"
          type="date"
          register={register}
          error={errors.dueDate?.message}
        />
        {errors.root?.message && <FormError error={errors.root.message} />}

        <SubmitButton
          isValid={!!isFormValid}
          isSubmitting={isSubmitting}
          isLoading={mutationLoading}
          label="Oluştur"
        />
      </form>
    </div>
  );
};

export default TaskUpdateForm;
