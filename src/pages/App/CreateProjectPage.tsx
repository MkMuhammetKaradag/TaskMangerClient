
import { useLocation, useNavigate } from 'react-router-dom';
import {  useMutation, useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import {
  FormError,
  InputField,
  SelectUserField,
  SubmitButton,
  TextAreaField,
} from '../../components/Auth/FormComponents';
import { User, UserRole } from '../../types/redux';
import { CREATE_PROJECT } from '../../graphql/mutations';
import { GET_COMPANY_USERS } from '../../graphql/queries';
import CloseButton from '../../components/App/Common/CloseButton';
// Zod şeması
const projectSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Project name must be at least 3 characters')
      .max(100, 'Project name must be less than 100 characters'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description must be less than 1000 characters'),
    projectManagerId: z
      .string()
      .min(1, 'Project manager selection is required'),
    teamMemberIds: z
      .array(z.string())
      .min(1, 'At least one team member must be selected')
      .max(10, 'Maximum 10 team members can be selected'),
    startDate: z
      .string()
      .min(1, 'Start date is required')
      .refine((date) => new Date(date) >= new Date(), {
        message: 'Start date must be in the future',
      }),
    endDate: z
      .string()
      .min(1, 'End date is required')
      .refine((date) => new Date(date) >= new Date(), {
        message: 'End date must be in the future',
      }),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'], // hata mesajını endDate alanına bağla
  });

type ProjectFormData = z.infer<typeof projectSchema>;

interface GetCompanyUsersQueryResult {
  getCompanyUsers: User[];
}

interface CreateProjectMutationResult {
  createProject: {
    _id: string;
  };
}

interface CreateProjectOperationVariables {
  input: ProjectFormData;
}
const CreateProjectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      projectManagerId: '',
      teamMemberIds: [],
      startDate: '',
      endDate: '',
    },
  });

  // Mutations ve Queries
  const [createProject, { loading: mutationLoading }] = useMutation<
    CreateProjectMutationResult,
    CreateProjectOperationVariables
  >(CREATE_PROJECT, {
    onCompleted: () => {
      navigate('/projects');
    },
    onError: (error) => {
      console.error('Error creating project:', error);
    },
  });

  const { data: usersData, loading: usersLoading } =
    useQuery<GetCompanyUsersQueryResult>(GET_COMPANY_USERS);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await createProject({
        variables: {
          input: {
            ...data,
            startDate: new Date(data.startDate).toLocaleDateString('tr-TR'),
            endDate: new Date(data.endDate).toLocaleDateString('tr-TR'),
          },
        },
      });
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
  const users = usersData?.getCompanyUsers;
  const isFormValid =
    watch('name') &&
    watch('description') &&
    watch('projectManagerId') &&
    watch('teamMemberIds') &&
    watch('startDate') &&
    watch('endDate');
  const handleClose = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    navigate(backgroundLocation?.pathname || '/', { replace: true });
  };
  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 overflow-auto bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <CloseButton onClick={handleClose} />
      {/* <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"> */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-screen-sm  p-10  mt-10 md:mt-0 w-full mx-auto bg-white  rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold  text-gray-900 mb-6">
          Create New Project
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Project Name "
            name="name"
            type="name"
            placeholder="project"
            register={register}
            error={errors.name?.message}
          />
          <TextAreaField
            label="Project Description "
            name="description"
            rows={4}
            placeholder="project description"
            register={register}
            error={errors.description?.message}
          ></TextAreaField>

          <SelectUserField
            label=" Project Manager"
            name="projectManagerId"
            size={1}
            register={register}
            error={errors.projectManagerId?.message}
            multiple={false}
            users={users.filter((user) =>
              user.roles.some((role) =>
                [UserRole.ADMIN, UserRole.EXECUTIVE].includes(role)
              )
            )}
          ></SelectUserField>

          <SelectUserField
            label=" Project  Team Members"
            name="teamMemberIds"
            size={4}
            register={register}
            error={errors.teamMemberIds?.message}
            multiple={true}
            users={users}
          ></SelectUserField>
          <div className="flex justify-between">
            <InputField
              label=" Start Date "
              name="startDate"
              type="date"
              register={register}
              error={errors.startDate?.message}
            />

            <InputField
              label=" End Date "
              name="endDate"
              type="date"
              register={register}
              error={errors.endDate?.message}
            />
          </div>
          {errors.root?.message && <FormError error={errors.root.message} />}

          <SubmitButton
            isValid={!!isFormValid}
            isSubmitting={isSubmitting}
            isLoading={mutationLoading}
            label="Oluştur"
          />
        </form>
      </div>
      {/* </div> */}
    </div>
  );
};

export default CreateProjectPage;
