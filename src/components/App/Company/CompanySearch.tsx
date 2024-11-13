import React, { useCallback, useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
const SEARCH_COMPANIES = gql`
  query searchCompanies($input: SearchCompaniesInput!) {
    searchCompanies(input: $input) {
      companies {
        _id
        name
        phoneNumber
      }
      totalCount
    }
  }
`;

interface Company {
  _id: string;
  name: string;
  phoneNumber?: string;
}

const CompanySearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 1;
  const navigate = useNavigate();
  const [searchCompanies, { data, loading, fetchMore }] = useLazyQuery(
    SEARCH_COMPANIES,
    {
      fetchPolicy: 'no-cache',
    }
  );

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length >= 3) {
        searchCompanies({
          variables: {
            input: {
              searchText: query,
              page: 1,
              limit,
            },
          },
        });
      }
    }, 300),
    []
  );
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearchQuery(e.target.value);
  };

  const loadMore = () => {
    if (!hasMore) return;
    fetchMore({
      variables: {
        input: {
          searchText: searchQuery,
          page: page + 1,
          limit,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          fetchMoreResult.searchCompanies.companies.length === 0
        ) {
          setHasMore(false);
          return prev;
        }
        setPage(page + 1);
        setHasMore(fetchMoreResult.searchCompanies.companies.length === limit);
        return {
          searchCompanies: {
            ...prev.searchCompanies,
            companies: [
              ...prev.searchCompanies.companies,
              ...fetchMoreResult.searchCompanies.companies,
            ],
          },
        };
      },
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Company Search"
        value={searchQuery}
        onChange={handleInputChange}
        className=" w-full bg-slate-800 p-2   border  rounded-md shadow-lg"
      />
      {loading && <p>Yükleniyor...</p>}

      {searchQuery.trim().length < 3 ? (
        <p className="text-gray-500">
          Arama yapmak için en az 3 karakter girin
        </p>
      ) : loading ? (
        <p>Aranıyor...</p>
      ) : data && data.searchCompanies.companies ? (
        <>
          {data.searchCompanies.companies.map((company: Company) => (
            <div
              key={company._id}
              className="cursor-pointer p-2 flex  mt-2 hover:bg-slate-800"
              onClick={() => {
                navigate(`/company/${company._id}`);
              }}
            >
              <div>
                <p className="font-bold">{company.name}</p>
                <p className="text-sm text-gray-400">{company?.phoneNumber}</p>
              </div>
            </div>
          ))}
          <div
            onClick={loadMore}
            className={`${
              data.searchCompanies.totalCount <=
                data.searchCompanies.companies.length && 'hidden'
            } hover:bg-slate-800  text-center items-center justify-center p-3`}
          >
            +
          </div>
        </>
      ) : (
        <span>Sonuç bulunamadı</span>
      )}
    </div>
  );
};

export default CompanySearch;
