import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import CloseButton from '../../components/App/Common/CloseButton';
import {
  FormError,
  InputField,
  SubmitButton,
  TextAreaField,
} from '../../components/Auth/FormComponents';
import { gql, useMutation } from '@apollo/client';
const companySchema = z.object({
  name: z
    .string()
    .min(3, 'company name must be at least 3 characters')
    .max(100, 'company name must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
});

const CREATE_COMPANY_REQUEST = gql`
  mutation CreateCompanyRequest($input: CreateCompanyRequestInput!) {
    createCompanyRequest(input: $input) {
      _id
    }
  }
`;

type CompanyFormData = z.infer<typeof companySchema>;
const CreateCompany = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [createCompanyRequest, { loading: createCompanyRequestLoading }] =
    useMutation(CREATE_COMPANY_REQUEST);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      description: '',
      phoneNumber: null,
      address: null,
      website: null,
    },
  });
  const isFormValid = watch('name') && watch('description');
  const onSubmit = async (data: CompanyFormData) => {
    try {
      const response = await createCompanyRequest({
        variables: { input: data },
      });
      console.log(
        'Company created successfully:',
        response.data.createCompanyRequest
      );
      const backgroundLocation = location.state?.backgroundLocation;
      navigate(backgroundLocation?.pathname || '/', { replace: true });
    } catch (err) {
      console.error('Error creating company request:', err);
    }
  };

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
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-screen-sm  p-10  mt-10 md:mt-0 w-full mx-auto bg-white  rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold  text-gray-900 mb-6">
          Create New Company Request
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Company Name "
            name="name"
            type="text"
            placeholder="Company"
            register={register}
            error={errors.name?.message}
          />
          <TextAreaField
            label=" Request Description "
            name="description"
            rows={4}
            placeholder="Explain your reason for opening a company"
            register={register}
            error={errors.description?.message}
          ></TextAreaField>
          <InputField
            label="Company address "
            name="address"
            type="text"
            placeholder="address"
            register={register}
            error={errors.name?.message}
          />
          <InputField
            label="Company website "
            name="website"
            type="text"
            placeholder="website"
            register={register}
            error={errors.name?.message}
          />
          <InputField
            label="Company phoneNumber "
            name="phoneNumber"
            type="text"
            placeholder="023156"
            register={register}
            error={errors.name?.message}
          />
          {errors.root?.message && <FormError error={errors.root.message} />}

          <SubmitButton
            isValid={!!isFormValid}
            isSubmitting={isSubmitting}
            isLoading={createCompanyRequestLoading}
            label="Oluştur"
          />
        </form>
      </div>
    </div>
  );
};

export default CreateCompany;
