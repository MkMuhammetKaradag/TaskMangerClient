import React, { useCallback, useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { debounce } from 'lodash';
const SEARCH_USERS = gql`
  query SearchUsers($input: SearchUsersInput!) {
    searchUsers(input: $input) {
      users {
        _id
        firstName
        lastName
        userName
        profilePhoto
        company {
          _id
          name
        }
      }
      totalCount
    }
  }
`;

interface User {
  _id: string;
  userName: string;
  profilePhoto: string | null;
}

interface UserSearchProps {
  onSelectUser: (user: User) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 2;
  const [searchUsers, { data, loading, fetchMore }] =
    useLazyQuery(SEARCH_USERS);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length >= 3) {
        searchUsers({
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
          fetchMoreResult.searchUsers.users.length === 0
        ) {
          setHasMore(false);
          return prev;
        }
        setPage(page + 1);
        setHasMore(fetchMoreResult.searchUsers.users.length === limit);
        return {
          searchUsers: {
            ...prev.searchUsers,
            users: [
              ...prev.searchUsers.users,
              ...fetchMoreResult.searchUsers.users,
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
        placeholder="Ara"
        value={searchQuery}
        onChange={handleInputChange}
        className="w-80 p-2   border  rounded-md shadow-lg"
      />
      {loading && <p>Yükleniyor...</p>}

      {searchQuery.trim().length < 3 ? (
        <p className="text-gray-500">
          Arama yapmak için en az 3 karakter girin
        </p>
      ) : loading ? (
        <p>Aranıyor...</p>
      ) : data && data.searchUsers.users ? (
        <>
          {data.searchUsers.users.map((user: User) => (
            <div
              key={user._id}
              className="cursor-pointer p-2 flex  hover:bg-gray-200"
              onClick={() => onSelectUser(user)}
            >
              <img
                src={user.profilePhoto || 'https://via.placeholder.com/40'}
                alt="User"
                className="rounded-full w-10 h-10  mr-2 object-cover"
              />
              <div>
                <p className="font-bold">{user.userName}</p>
                <p className="text-sm text-gray-400">first-last </p>
              </div>
            </div>
          ))}
          <div
            onClick={loadMore}
            className={`${
              data.searchUsers.totalCount <= data.searchUsers.users.length &&
              'hidden'
            } hover:bg-gray-100  text-center items-center justify-center p-3`}
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

export default UserSearch;
