import axios from "axios";
import React, { useState, useRef } from "react";
import { API_PATHS, baseUrl } from "../utility/apiPaths";
import ChatUserCardSkeleton from "./ChatUserSkeleton";
import UserCard from "./UserCard";

const SearchUsers = ({ isLink, onUserSelect = () => {} }) => {
  const [foundUsers, setFoundUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!newQuery.trim()) {
        setFoundUsers([]);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.post(
          baseUrl + API_PATHS.user.GET_USERS,
          { query: newQuery },
          { withCredentials: true }
        );

        setFoundUsers(res.data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="w-full flex flex-col">
      <input
        value={query}
        onChange={handleQueryChange}
        className="rounded-2xl h-14 bg-white/5 p-3 text-lg mt-2 w-full mb-3"
        placeholder="Search Users"
      />

      <div className="h-fit max-h-[400px] overflow-y-auto p-2 text-white space-y-1 flex flex-col">
        {loading && (
          <>
            <ChatUserCardSkeleton />
            <ChatUserCardSkeleton />
            <ChatUserCardSkeleton />
          </>
        )}

        {query &&
          foundUsers?.map((user) => {
            if (isLink) {
              return (
                <UserCard
                  key={user?.id}
                  id={user?.id}
                  avatar={user?.avatar}
                  fullname={user?.fullname}
                  username={user?.username}
                  isLink={isLink}
                />
              );
            }
            return (
              <button
                onClick={() => {
                  setQuery("");
                  onUserSelect(user);
                }}
              >
                <UserCard
                  key={user?.id}
                  id={user?.id}
                  avatar={user?.avatar}
                  fullname={user?.fullname}
                  username={user?.username}
                  isLink={isLink}
                />
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default SearchUsers;
