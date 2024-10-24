import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
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

// GraphQL Tanımlamaları
const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      _id
      name
      description
    }
  }
`;

// Kullanıcıları çekmek için query
const GET_USERS = gql`
  query GetUsers {
    getCompanyUsers {
      _id
      firstName
      lastName
      roles
    }
  }
`;

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setError,
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
  const [createProject, { loading: mutationLoading }] = useMutation(
    CREATE_PROJECT,
    {
      onCompleted: () => {
        navigate('/projects');
      },
      onError: (error) => {
        console.error('Error creating project:', error);
        // Burada bir hata bildirimi gösterebilirsiniz
      },
    }
  );

  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);

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
  const users = usersData.getCompanyUsers;
  const isFormValid =
    watch('name') &&
    watch('description') &&
    watch('projectManagerId') &&
    watch('teamMemberIds') &&
    watch('startDate') &&
    watch('endDate');
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
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
              users={users}
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
      </div>
    </div>
  );
};

export default CreateProjectPage;
