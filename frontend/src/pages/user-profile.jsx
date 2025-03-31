// import React, { useEffect, useState } from "react";
// import { useUser } from "../context/userContext";
// import UpdateUser from "../components/UpdateUser";
// import Modal from "../components/Modal";
// import { MdOutlineLibraryAdd } from "react-icons/md";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { API_PATHS, baseUrl } from "../utility/apiPaths";

// const Profile = () => {
//   const { user, updateUser } = useUser();

//   const [profile, setProfile] = useState(null);
//   const [openUpdateModal, setOpenUpdateModal] = useState(false);
//   const [openPostModal, setOpenPostModal] = useState(false);

//   const { username } = useParams();

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const res = await axios.get(
//           baseUrl + API_PATHS.user.GET_PROFILE + "/" + username,
//           {
//             withCredentials: true,
//           }
//         );

//         const data = res.data;
//         setProfile(data.profile);
//         console.log("profile is ", profile);
//       } catch (err) {
//         console.log("error while getting profile of user from params", err);
//       }
//     };

//     fetchUserDetails();
//   }, [username]);

//   return (
//     <div className="text-white w-full md:w-[600px] lg:w-[700px] mx-auto px-4">
//       <ProfileHeader
//         user={user}
//         profile={profile}
//         updateUser={updateUser}
//         openUpdateModal={openUpdateModal}
//         setOpenUpdateModal={setOpenUpdateModal}
//       />
//     </div>
//   );
// };

// const ProfileHeader = ({
//   user,
//   profile,
//   updateUser,
//   openUpdateModal,
//   setOpenUpdateModal,
// }) => {
//   const [isFollowing, setIsFollowing] = useState(false);

//   useEffect(() => {
//     if (user && profile && user.followers) {
//       // Check if the profile user is in the logged-in user's followings
//       const following = user.followers.some(
//         (follower) => follower.followingId === profile.id
//       );
//       setIsFollowing(following);
//     }
//   }, [user, profile]);

//   console.log("Got profile", profile);

//   const handleFollow = async () => {
//     try {
//       const res = await axios.post(
//         baseUrl + API_PATHS.user.FOLLOW + "/" + profile.id,
//         {},
//         {
//           withCredentials: true,
//         }
//       );
//       console.log("handeled follow unfollow");

//       setIsFollowing((prev) => !prev);
//     } catch (err) {
//       console.log("Error while follow unfollow", err);
//     }
//   };
//   return (
//     <div className="flex items-center p-2 mx-2 my-4 flex-col w-full space-y-3 ">
//       <section className="flex justify-between w-full items-center">
//         <div>
//           <h2 className="text-3xl font-bold">{profile?.fullname}</h2>
//           <h3 className="text-xl text-white/25">@{profile?.username}</h3>
//         </div>
//         <div className="overflow-hidden rounded-full size-32">
//           <img
//             src={profile && profile.avatar ? profile.avatar : "/trump.webp"}
//             className="object-cover w-full h-full"
//             alt="Profile"
//           />
//         </div>
//       </section>
//       <div className="flex w-full justify-between text-white/70 mt-2">
//         <p>{profile?.bio}</p>
//         {user?.id === profile?.id ? (
//           <div className="flex space-x-2">
//             <button
//               className="bg-white/20 hover:bg-white/30 p-2 rounded-lg cursor-pointer flex justify-center  items-center"
//               onClick={() => console.log("post here")}
//             >
//               <MdOutlineLibraryAdd className="size-5 mr-2 "></MdOutlineLibraryAdd>
//               Post
//             </button>
//             <button
//               className="bg-white/20 hover:bg-white/30 p-2 rounded-lg cursor-pointer"
//               onClick={() => setOpenUpdateModal(true)}
//             >
//               Update Profile
//             </button>
//           </div>
//         ) : (
//           <button
//             className={`p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
//               isFollowing
//                 ? "bg-gray-500 hover:bg-gray-600 text-white" // Unfollow state
//                 : "bg-blue-500 hover:bg-blue-600 text-white" // Follow state
//             }`}
//             onClick={handleFollow}
//           >
//             {isFollowing ? "Unfollow" : "Follow"}
//           </button>
//         )}
//         <Modal
//           open={openUpdateModal}
//           onClose={() => {
//             setOpenUpdateModal(false);
//           }}
//         >
//           <UpdateUser
//             user={user}
//             updateUser={updateUser}
//             setOpenUpdateModal={setOpenUpdateModal}
//           ></UpdateUser>
//         </Modal>
//       </div>
//       <div className="border-t-[1px] border-white/20 w-full my-2"></div>
//       <ul className="flex space-x-6 my-2 w-full justify-around text-lg text-white/80">
//         <DataItem label="Posts" count={profile?.posts?.length} />
//         <DataItem label="Followers" count={profile?.followings?.length} />
//         <DataItem label="Following" count={profile?.followers?.length} />
//       </ul>
//     </div>
//   );
// };

// const DataItem = ({ label, count }) => {
//   return (
//     <li className="flex flex-col items-center ">
//       <span className="text-2xl font-bold tracking-wide text-white">
//         {count}
//       </span>
//       <span className="text-sm text-white/70">{label}</span>
//     </li>
//   );
// };
// export default Profile;

import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "../context/userContext";
import UpdateUser from "../components/UpdateUser";
import Modal from "../components/Modal";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_PATHS, baseUrl } from "../utility/apiPaths";
import LoadingSpinner from "../components/LoadingSpinner";
import Post from "./post";
import NewPost from "../components/NewPost";
import SmallPost from "../components/SmallPost";

const Profile = () => {
  const { user, updateUser } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openPostModal, setOpenPostModal] = useState(false);

  const [userPosts, setUserPosts] = useState([]);

  const { username } = useParams();

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${baseUrl}${API_PATHS.user.GET_PROFILE}/${username}`,
          {
            withCredentials: true,
          }
        );

        const data = res.data;
        setProfile(data.profile);
        setUserPosts([...data.profile.posts].reverse());
      } catch (err) {
        console.error("Error while getting profile of user from params:", err);
        setError(err.response?.data?.message || "Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserDetails();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="text-white text-center py-8">
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  }

  return (
    <div className="text-white w-full md:w-[600px] lg:w-[700px] mx-auto px-4">
      {profile ? (
        <>
          <ProfileHeader
            user={user}
            profile={profile}
            updateUser={updateUser}
            openUpdateModal={openUpdateModal}
            setOpenUpdateModal={setOpenUpdateModal}
            openPostModal={openPostModal}
            setOpenPostModal={setOpenPostModal}
            setUserPosts={setUserPosts}
          />
          <div className="flex flex-col space-y-2">
            {userPosts.map((post) => (
              // <Link to={`/${profile.username}/post/${post.id}`}>{post.id}</Link>
              <SmallPost post={post} key={post.id}></SmallPost>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">Profile not found</div>
      )}
    </div>
  );
};

const ProfileHeader = ({
  user,
  profile,
  updateUser,
  openUpdateModal,
  setOpenUpdateModal,
  openPostModal,
  setOpenPostModal,
  setUserPosts,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followActionInProgress, setFollowActionInProgress] = useState(false);

  useEffect(() => {
    if (user && profile && user.followers) {
      const following = user.followers.some(
        (follower) => follower.followingId === profile.id
      );
      setIsFollowing(following);
    }
  }, [user, profile]);

  const handleFollow = useCallback(async () => {
    if (followActionInProgress || !profile?.id) return;

    setFollowActionInProgress(true);
    try {
      await axios.post(
        `${baseUrl}${API_PATHS.user.FOLLOW}/${profile.id}`,
        {},
        {
          withCredentials: true,
        }
      );

      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("Error while follow/unfollow:", err);
    } finally {
      setFollowActionInProgress(false);
    }
  }, [profile, followActionInProgress]);

  const openPostModalHandler = () => {
    setOpenPostModal(true);
  };
  const closePostModalHandler = () => {
    setOpenPostModal(false);
  };

  const openUpdateModalHandler = () => {
    setOpenUpdateModal(true);
  };

  const closeUpdateModalHandler = () => {
    setOpenUpdateModal(false);
  };

  return (
    <div className="flex items-center p-2 mx-2 my-4 flex-col w-full space-y-3 ">
      <section className="flex justify-between w-full items-center">
        <div>
          <h2 className="text-3xl font-bold">{profile?.fullname}</h2>
          <h3 className="text-xl text-white/25">@{profile?.username}</h3>
        </div>
        <div className="overflow-hidden rounded-full size-32">
          {profile && profile.avatar ? (
            <img
              src={profile?.avatar || "/trump.webp"}
              className="object-cover w-full h-full"
              alt="Profile"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#101010] flex items-center justify-center text-white text-5xl font-medium">
              {profile?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>
      </section>
      <div className="flex w-full justify-between text-white/70 mt-2">
        <p>{profile?.bio || "No bio available"}</p>
        {user?.id === profile?.id ? (
          <div className="flex space-x-2">
            <button
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg cursor-pointer flex justify-center items-center"
              onClick={openPostModalHandler}
            >
              <MdOutlineLibraryAdd className="size-5 mr-2" />
              Post
            </button>
            <button
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg cursor-pointer"
              onClick={openUpdateModalHandler}
            >
              Update Profile
            </button>
          </div>
        ) : (
          <button
            className={`p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
              followActionInProgress
                ? "bg-gray-400 text-white cursor-not-allowed opacity-70"
                : isFollowing
                ? "bg-gray-500 hover:bg-gray-600 text-white" // Unfollow state
                : "bg-blue-500 hover:bg-blue-600 text-white" // Follow state
            }`}
            onClick={handleFollow}
            disabled={followActionInProgress}
          >
            {followActionInProgress
              ? "Processing..."
              : isFollowing
              ? "Unfollow"
              : "Follow"}
          </button>
        )}
        <Modal open={openUpdateModal} onClose={closeUpdateModalHandler}>
          <UpdateUser
            user={user}
            updateUser={updateUser}
            setOpenUpdateModal={setOpenUpdateModal}
          />
        </Modal>
        <Modal open={openPostModal} onClose={closePostModalHandler}>
          <NewPost
            user={user}
            setOpenPostModal={setOpenPostModal}
            setUserPosts={setUserPosts}
          />
        </Modal>
      </div>
      <div className="border-t-[1px] border-white/20 w-full my-2"></div>
      <ul className="flex space-x-6 my-2 w-full justify-around text-lg text-white/80">
        <DataItem label="Posts" count={profile?.posts?.length || 0} />
        <DataItem label="Followers" count={profile?.followings?.length || 0} />
        <DataItem label="Following" count={profile?.followers?.length || 0} />
      </ul>
    </div>
  );
};

const DataItem = ({ label, count }) => {
  return (
    <li className="flex flex-col items-center ">
      <span className="text-2xl font-bold tracking-wide text-white">
        {count}
      </span>
      <span className="text-sm text-white/70">{label}</span>
    </li>
  );
};

export default Profile;
