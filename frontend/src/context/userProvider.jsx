import { useEffect, useState } from "react";
import { UserContext } from "./userContext";
import Cookies from "js-cookie";
import axios from "axios";

import { baseUrl } from "../utility/apiPaths";
import { API_PATHS } from "../utility/apiPaths";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      // console.log("userProvider called");
      try {
        // Remove this check since we can't read HTTP-only cookies
        // if (!Cookies.get("authToken")) {
        //   console.log("No cookie found");
        //   setUser(null);
        //   return;
        // }

        const resp = await axios.get(
          baseUrl + API_PATHS.auth.GET_USER_DETAILS,
          { withCredentials: true }
        );

        const userdata = resp.data.user;
        setUser(userdata);
        localStorage.setItem("thread-user", userdata);
        // console.log("fetched user from backend", userdata);
      } catch (err) {
        localStorage.removeItem("thread-user");

        setUser(null);

        console.log(
          "Authentication failed or error fetching user details",
          err
        );
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  const updateUser = (user) => {
    setUser(user);
  };
  const removeUser = () => {
    setUser(null);
  };
  return (
    <UserContext.Provider value={{ user, removeUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
