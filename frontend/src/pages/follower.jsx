import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import axios from "axios";
import { API_PATHS, baseUrl } from "../utility/apiPaths";
import LoadingSpinner from "../components/LoadingSpinner";
import UserCard from "../components/UserCard";

const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const [followersToShow, setFollowersToShow] = useState(followers);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (filter === "") {
      setFollowersToShow(followers);
      return;
    }

    const filtered = followers.filter(
      (follower) =>
        follower.username.toLowerCase().includes(filter.toLowerCase()) ||
        follower.fullname.toLowerCase().includes(filter.toLowerCase())
    );

    setFollowersToShow(filtered);
  }, [filter, followers]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + API_PATHS.user.GET_FOLLOWERS, {
          withCredentials: true,
        });
        const data = res.data;
        // console.log(data);
        setFollowers(data.followers);
      } catch (err) {
        console.log("error occured while getting followers data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []);
  //   const { user } = useUser();

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center md:min-w-[500px]">
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }

  if (followers.length === 0) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center md:min-w-[500px]">
        <p>Current No Followers of yours </p>
      </div>
    );
  }

  return (
    <div className="md:min-w-[500px] px-2  overflow-y-auto">
      <input
        value={filter}
        onChange={handleFilterChange}
        className="rounded-2xl h-14 bg-white/5  p-3 text-lg mt-2  w-full mb-3"
        placeholder="Search Followers"
      ></input>
      {followersToShow?.map((ele) => {
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

export default Followers;
