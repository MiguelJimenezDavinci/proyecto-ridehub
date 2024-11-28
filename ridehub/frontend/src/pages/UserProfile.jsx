import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faUser,
  faAudioDescription,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { getUserById, followUser, unfollowUser } from "../service/user";
import { getPostsByUserId } from "../service/post";
import { getEventsByUserId } from "../service/events";
import SecondaryButton from "../components/Button/SecondaryButton";

const UserProfile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("posts");
  const [followersCount, setFollowersCount] = useState(0);
  const navigate = useNavigate();

  const categoryStyles = {
    encuentro: "bg-red-200 text-red-800",
    competencia: "bg-blue-200 text-blue-800",
    rally: "bg-green-200 text-green-800",
    exhibición: "bg-yellow-200 text-yellow-800",
    otros: "bg-gray-200 text-gray-800",

    motos: "bg-red-200 text-red-800",
    accesorios: "bg-blue-200 text-blue-800",
    rutas: "bg-yellow-200 text-yellow-800",
    eventos: "bg-green-200 text-green-800",
    comunidad: "bg-slate-200 text-gray-800",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserById(id);
        const userPosts = await getPostsByUserId(id);
        const userEvents = await getEventsByUserId(id);

        setProfileData(userProfile.data);
        setPosts(userPosts || []);
        setEvents(userEvents || []);
        setIsFollowing(userProfile.data.isFollowing);
      } catch (error) {
        console.error("Error al obtener los datos del perfil:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleFollowToggle = async (id) => {
    try {
      if (!id) {
        throw new Error("El ID del usuario es obligatorio.");
      }

      if (isFollowing) {
        await unfollowUser(id);
      } else {
        await followUser(id); // Llamar a la API para seguir
      }

      setIsFollowing((prev) => !prev);

      if (updateFollowersCount) {
        updateFollowersCount(id, !isFollowing);
      }
    } catch (error) {
      console.error(
        "Error al cambiar el estado de seguimiento:",
        error.message || error
      );
    }
  };

  const updateFollowersCount = (userId, isFollowing) => {
    setFollowersCount((prev) => (isFollowing ? prev + 1 : prev - 1));
  };

  const handleViewToggle = (viewType) => setView(viewType);

  const handleShowPost = (postId) => navigate(`/post/${postId}`);
  const handleShowEvent = (eventId) => navigate(`/events/${eventId}`);

  return (
    <div className="flex flex-col items-center p-4 bg-[url('../rider-1.jpg')] min-h-screen mt-16">
      <div className="flex flex-col md:flex-row max-w-screen-lg w-full bg-white shadow-md rounded-lg p-4">
        {profileData && (
          <div className="w-full">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <img
                src={
                  profileData.photo
                    ? `http://localhost:5000/uploads/${profileData.photo}`
                    : "../default-image.jpg"
                }
                alt="Profile"
                className="w-40 h-40 md:w-52 md:h-52 object-cover object-center rounded-full mx-auto md:mx-0"
              />
              <div className="flex flex-col flex-1 items-center md:items-start">
                <div className="flex flex-col sm:flex-row sm:justify-between w-full mb-4">
                  <p className="text-2xl font-bold text-center sm:text-left">
                    @{profileData.username}
                  </p>
                  <SecondaryButton
                    onClick={() => handleFollowToggle(id)}
                    className={`border-2 px-4 py-2 rounded ${
                      isFollowing
                        ? "bg-red-700 text-white border-red-700"
                        : "text-red-700 border-red-700 hover:bg-red-700 hover:text-white"
                    } transition-all duration-300`}
                  >
                    {isFollowing ? "Siguiendo" : "Seguir"}
                  </SecondaryButton>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-6 sm:p-4 justify-center md:justify-start text-gray-600">
                  <button
                    className="hover:text-red-700"
                    onClick={() => handleViewToggle("events")}
                  >
                    {events.length} Eventos
                  </button>
                  <button
                    className="hover:text-red-700"
                    onClick={() => handleViewToggle("posts")}
                  >
                    {posts.length} Publicaciones
                  </button>
                  <button className="hover:text-red-700">
                    {profileData.followersCount || 0} Seguidores
                  </button>
                  <button className="hover:text-red-700">
                    {profileData.followingCount || 0} Siguiendo
                  </button>
                </div>
                <div className="mt-4 text-center md:text-left">
                  <p className="font-semibold">{profileData.fullName}</p>
                  <p className="text-gray-600">
                    {<FontAwesomeIcon icon={faAudioDescription} />}{" "}
                    {profileData.bio}
                  </p>
                  <p className="text-gray-600">
                    {<FontAwesomeIcon icon={faLocationDot} />}{" "}
                    {profileData.location}
                  </p>
                </div>
                {profileData.bikeDetails ? (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold">
                      Detalles de la Moto
                    </h2>
                    <p>
                      Marca:{" "}
                      {profileData.bikeDetails.brand || "No especificado"}
                    </p>
                    <p>
                      Modelo:{" "}
                      {profileData.bikeDetails.model || "No especificado"}
                    </p>
                    <p>
                      Año: {profileData.bikeDetails.year || "No especificado"}
                    </p>
                    <p>
                      Matrícula:{" "}
                      {profileData.bikeDetails.licensePlate ||
                        "No especificado"}
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500">
                    No hay detalles de la motocicleta disponibles.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewToggle("posts")}
                  className={`border-2 border-red-700 font-medium px-4 py-2 w-full text-center rounded${
                    view === "posts"
                      ? "  bg-red-700 text-white transition-all duration-300 shadow-lg rounded-2xl hover:bg-red-800 hover:border-red-800  hover:rounded-2xl hover:text-white"
                      : "  text-red-700 transition-all duration-300 rounded-xl hover:bg-red-700 hover:text-white hover:rounded-2xl"
                  }`}
                >
                  Publicaciones
                </button>
                <button
                  onClick={() => handleViewToggle("events")}
                  className={`border-2 border-red-700 font-medium px-4 py-2 w-full text-center rounded ${
                    view === "events"
                      ? "  bg-red-700 text-white transition-all duration-300 shadow-lg rounded-2xl hover:bg-red-800 hover:border-red-800  hover:rounded-2xl hover:text-white"
                      : "  text-red-700 transition-all duration-300 rounded-xl hover:bg-red-700 hover:text-white hover:rounded-2xl"
                  }`}
                >
                  Eventos
                </button>
              </div>
              <div className="mt-6">
                {view === "posts" ? (
                  posts.length === 0 ? (
                    <p className="mt-4 text-center text-gray-600">
                      No hay publicaciones disponibles.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {posts.map((post) => (
                        <div
                          key={post._id}
                          className="cursor-pointer border rounded shadow-md"
                          onClick={() => handleShowPost(post._id)}
                        >
                          <img
                            src={`http://localhost:5000/${post.media}`}
                            alt="Post"
                            className="w-full h-48 object-cover rounded-t"
                          />
                          <div className="w-full p-4 ">
                            <div>
                              <p className="text-gray-500 text-sm mt-2">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                              <p className="font-semibold mt-2">
                                {post.description.length > 80
                                  ? `${post.description.substring(0, 80)}...`
                                  : post.description}
                              </p>

                              <p className="flex items-center text-gray-500 mt-1">
                                <FontAwesomeIcon
                                  icon={faLocationDot}
                                  className="mr-1"
                                />
                                {post.location}
                              </p>

                              {post.category && (
                                <span
                                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                    categoryStyles[
                                      post.category.toLowerCase()
                                    ] || categoryStyles.otros
                                  }`}
                                >
                                  {post.category}
                                </span>
                              )}

                              <div className="flex justify-between items-center mt-2 text-gray-500">
                                <div className="flex items-center">
                                  <FontAwesomeIcon
                                    icon={faThumbsUp}
                                    className="mr-1"
                                  />
                                  {post.likes.length}
                                </div>

                                <div className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-1 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M20 2h-16c-1.104 0-2 0.896-2 2v16c0 1.104 0.896 2 2 2h8l4 4v-4h4c1.104 0 2-0.896 2-2v-16c0-1.104-0.896-2-2-2zm0 16h-5v3l-3-3h-8v-14h16v14zm-12-9h-3v2h3v-2zm5 0h-3v2h3v-2zm5 0h-3v2h3v-2zm-10 3h-3v2h3v-2zm5 0h-3v2h3v-2zm5 0h-3v2h3v-2zm-10 3h-3v2h3v-2zm5 0h-3v2h3v-2zm5 0h-3v2h3v-2z" />
                                  </svg>
                                  {post.comments.length}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : events.length === 0 ? (
                  <p className="text-center text-gray-600">
                    No hay eventos disponibles.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {events.map((event) => (
                      <div
                        key={event._id}
                        className="cursor-pointer border rounded shadow-md"
                        onClick={() => handleShowEvent(event._id)}
                      >
                        <img
                          src={`http://localhost:5000/${event.image}`}
                          alt="Post"
                          className="w-full h-48 object-cover rounded-t"
                        />
                        <div className="w-full p-4 ">
                          <div>
                            <p className="text-gray-500 text-sm mt-2">
                              {new Date(event.createdAt).toLocaleDateString()}
                            </p>
                            <p className="font-bold  text-2xl">{event.title}</p>
                            <p className="font-medium text-gray-600 mb-2">
                              {event.description.length > 80
                                ? `${event.description.substring(0, 80)}...`
                                : event.description}
                            </p>

                            <p className="flex items-center text-gray-500 mb-2">
                              <FontAwesomeIcon
                                icon={faLocationDot}
                                className="mr-1"
                              />
                              {event.location}
                            </p>

                            <p className="text-gray-500 mb-2">
                              <FontAwesomeIcon icon={faUser} className="mr-1" />
                              {event.participants.length}
                            </p>

                            {event.category && (
                              <span
                                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                  categoryStyles[
                                    event.category.toLowerCase()
                                  ] || categoryStyles.otros
                                }`}
                              >
                                {event.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
