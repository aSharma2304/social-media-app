import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import axios from "axios";
import { API_PATHS, baseUrl } from "../utility/apiPaths";
import LoadingSpinner from "../components/LoadingSpinner";
import UserCard from "../components/UserCard";

const Following = () => {
  const [followings, setFollowings] = useState([]);
  const [followingsToShow, setFollowingsToShow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (filter === "") {
      setFollowingsToShow(followings);
      return;
    }

    const filtered = followings.filter(
      (following) =>
        following.username.toLowerCase().includes(filter.toLowerCase()) ||
        following.fullname.toLowerCase().includes(filter.toLowerCase())
    );

    setFollowingsToShow(filtered);
  }, [filter, followings]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    const fetchFollowings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + API_PATHS.user.GET_FOLLOWING, {
          withCredentials: true,
        });
        const data = res.data;
        // console.log(data);
        setFollowings(data.followings);
      } catch (err) {
        console.log("error occured while getting followigs data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowings();
  }, []);
  //   const { user } = useUser();

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center md:min-w-[500px]">
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }

  if (followings.length === 0) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center md:min-w-[500px]">
        <p>Current Following no one </p>
      </div>
    );
  }

  return (
    <div className="md:min-w-[500px] px-2 overflow-y-auto">
      <input
        value={filter}
        onChange={handleFilterChange}
        className="rounded-2xl h-14 bg-white/5 p-3 text-lg mt-2 w-full mb-3"
        placeholder="Search Following"
      ></input>
      {followingsToShow?.map((ele) => {
        return (
          <UserCard
            username={ele.username}
            avatar={ele.avatar}
            fullname={ele.fullname}
            id={ele.id}
          ></UserCard>
        );
      })}
    </div>
  );
};

export default Following;
