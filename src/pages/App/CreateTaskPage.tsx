import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FormError,
  InputField,
  SelectEnumField,
  SelectProjectField,
  SelectUserField,
  SubmitButton,
  TextAreaField,
} from '../../components/Auth/FormComponents';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COMPANY_USERS } from '../../graphql/queries';
import { User } from '../../types/redux';
import { Project, TaskPriority, TaskStatus } from '../../types/graphql';
import { GET_PROJECTS_BY_COMPANY } from '../../graphql/queries/getProjectByCompany';
import { CREATE_TASK } from '../../graphql/mutations';
const TaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  projectId: z.string().min(1, 'Project manager selection is required'),
  assigneeId: z.string().min(1, 'Project manager selection is required'),
  status: z.nativeEnum(TaskStatus), // TaskStatus enum'unu Zod şemasında kullanma
  priority: z.nativeEnum(TaskPriority), // TaskPriority enum'unu Zod şemasında kullanma
  dueDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((date) => new Date(date) >= new Date(), {
      message: 'Start date must be in the future',
    }),
});
type TaskFormData = z.infer<typeof TaskSchema>;
interface GetCompanyUsersQueryResult {
  getCompanyUsers: User[];
}
interface GetProjectsByCompanyQueryResult {
  getProjectsByCompany: Project[];
}

interface CreateTaskMutationResult {
  createTask: {
    _id: string;
  };
}

interface CreateTaskOperationVariables {
  input: TaskFormData;
}
const CreateTaskPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: usersData, loading: usersLoading } =
    useQuery<GetCompanyUsersQueryResult>(GET_COMPANY_USERS);

  const { data: projectsData, loading: projectsLoading } =
    useQuery<GetProjectsByCompanyQueryResult>(GET_PROJECTS_BY_COMPANY);

  const [createTask, { loading: mutationLoading }] = useMutation<
    CreateTaskMutationResult,
    CreateTaskOperationVariables
  >(CREATE_TASK, {
    onCompleted: (res) => {
      navigate(`/task/${res.createTask._id}`, {
        state: { backgroundLocation: location },
      });
    },
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
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: '',
      description: '',
      assigneeId: '',
      projectId: '',
      dueDate: '',
      priority: TaskPriority.LOW,
      status: TaskStatus.DONE,
    },
  });
  const onSubmit = async (data: TaskFormData) => {
    try {
      await createTask({
        variables: {
          input: {
            ...data,
            dueDate: new Date(data.dueDate).toLocaleDateString('tr-TR'),
          },
        },
      });
      reset();
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
  if (!projectsData) {
    return <div>project is null</div>;
  }
  const isFormValid =
    watch('title') &&
    watch('description') &&
    watch('projectId') &&
    watch('assigneeId') &&
    watch('dueDate');
  const users = usersData?.getCompanyUsers;
  const projects = projectsData?.getProjectsByCompany;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create New Project
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              label="Task Title Name "
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
              name="assigneeId"
              size={1}
              register={register}
              error={errors.assigneeId?.message}
              multiple={false}
              users={users}
            ></SelectUserField>

            <SelectProjectField
              label="Task Project"
              name="projectId"
              size={1}
              register={register}
              error={errors.projectId?.message}
              multiple={false}
              projects={projects}
            ></SelectProjectField>
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
      </div>
    </div>
  );
};

export default CreateTaskPage;
