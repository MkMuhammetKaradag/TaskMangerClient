import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import {
  BiCalendar,
  BiCog,
  BiGlobe,
  BiLinkAlt,
  BiMapPin,
  BiPhone,
  BiUser,
} from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { UserRole } from '../../types/redux';

interface Company {
  _id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

const GET_COMPANY = gql`
  query getCompanyByUser {
    getCompanyByUser {
      _id
      name
      address
      phoneNumber
      website
      createdAt
      updatedAt
    }
  }
`;

const CompanyPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const roles = useAppSelector((state) => state.auth.user?.roles);

  // Normally you would fetch this data using Apollo Client
  const { loading, error, data } = useQuery(GET_COMPANY);
  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error.message}</div>;

  const companyData = data.getCompanyByUser as Company;
  const formatDate = (dateString: string) => {
    return new Date(+dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const dropdownMenuItems = [
    {
      icon: <BiCog className="w-5 h-5 mr-2" />,
      label: 'Ayarlar',
      onClick: () => {
        // Ayarlar sayfasına yönlendirme veya modal açma
        console.log('Ayarlar tıklandı');
      },
    },
    {
      icon: <BiUser className="w-5 h-5 mr-2" />,
      label: 'Çalışanlar',
      onClick: () => {
        // Kullanıcı yönetimi sayfasına yönlendirme
        console.log('Kullanıcılar tıklandı');
      },
    },
    {
      icon: <BiLinkAlt className="w-5 h-5 mr-2" />,
      label: 'Şirket Katılma İstekleri',
      onClick: () => {
        // Katılma istekleri sayfasına yönlendirme
        navigate('/company/join-requests/6724cfaf805c7b135790b8f3', {
          state: { backgroundLocation: location },
        });
      },
    },
  ];

  return (
    <div
      onClick={() => setIsDropdownOpen(false)}
      className="min-h-screen bg-gray-50 p-4 md:p-8"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
          Şirket Bilgileri
        </h1>

        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-6 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600">
              {companyData.name}
            </h2>
            {[UserRole.ADMIN, UserRole.EXECUTIVE].every((role) =>
              roles?.includes(role)
            ) && (
              <div className="relative">
                <BsThreeDotsVertical
                  size={24}
                  className="text-lg text-gray-500 hover:text-gray-900 hover:cursor-pointer"
                  onClick={toggleDropdown}
                />
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {dropdownMenuItems.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => {
                          item.onClick();
                          setIsDropdownOpen(false);
                        }}
                      >
                        {item.icon}
                        <span className="text-gray-800">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Address */}
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BiMapPin className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Adres</p>
                <p className="text-gray-900 mt-1">
                  {companyData.address || 'Empty'}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BiPhone className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Telefon</p>
                <p className="text-gray-900 mt-1">
                  {companyData.phoneNumber || 'Empty'}
                </p>
              </div>
            </div>

            {/* Website */}
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BiGlobe className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Website</p>
                <a
                  href={`https://${companyData.website || 'localhost'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 hover:underline mt-1 inline-block"
                >
                  {companyData.website || 'Empty'}
                </a>
              </div>
            </div>

            {/* Dates Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Created Date */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BiCalendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Oluşturulma Tarihi
                    </p>
                    <p className="text-gray-900 mt-1">
                      {formatDate(companyData.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Updated Date */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BiCalendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Son Güncelleme
                    </p>
                    <p className="text-gray-900 mt-1">
                      {formatDate(companyData.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
