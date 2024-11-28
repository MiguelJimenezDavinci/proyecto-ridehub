import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../service/auth";
import { getPostsByUserId, deletePost } from "../service/post";
import { getEventsByUserId, deleteEvent } from "../service/events";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faUser,
  faAudioDescription,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../components/Button/PrimaryButton";
import SecondaryButton from "../components/Button/SecondaryButton";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [view, setView] = useState("posts");
  const [loading, setLoading] = useState(true); // Estado de carga
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
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      try {
        const profileResponse = await getProfile();
        setProfileData(profileResponse.data);

        const postsResponse = await getPostsByUserId(user.id);
        setPosts(postsResponse);

        const eventsResponse = await getEventsByUserId(user.id);
        setEvents(eventsResponse);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Error al obtener los datos del perfil"
        );
      } finally {
        setLoading(false); // Desactiva el estado de carga al final
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, user]);

  const handleEditProfile = () => navigate("/edit-profile");
  const handleToggleView = (viewType) => setView(viewType);

  const handleUpdatePost = (postId) => navigate(`/update-post/${postId}`);
  const handleUpdateEvent = (eventId) => navigate(`/update-event/${eventId}`);

  const handleDeletePost = async (postId) => {
    if (!postId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID de publicación no válido.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deletePost(postId);
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "La publicación se eliminó correctamente.",
          timer: 2000,
        });
      } catch (error) {
        console.error("No se pudo eliminar la publicación:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al eliminar la publicación. Por favor, inténtalo más tarde.",
        });
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!eventId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID de evento no válido.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteEvent(eventId);
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El evento se eliminó correctamente.",
          timer: 2000,
        });
      } catch (error) {
        console.error("No se pudo eliminar el evento:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al eliminar el evento. Por favor, inténtalo más tarde.",
        });
      }
    }
  };

  const handleShowPost = (postId) => navigate(`/post/${postId}`);
  const handleShowEvent = (eventId) => navigate(`/events/${eventId}`);

  if (loading) {
    return <div>Cargando...</div>; // Mensaje de carga
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!profileData) {
    return <div>No se encontraron datos de perfil.</div>;
  }

  const missingFields = [];
  if (!profileData.fullName) missingFields.push("nombre completo");
  if (!profileData.bio) missingFields.push("biografía");
  if (!profileData.bikeDetails)
    missingFields.push("detalles de la motocicleta");
  if (!profileData.photo) missingFields.push("foto de perfil");
  if (!profileData.username) missingFields.push("nombre de usuario");

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
                  <p className="text-2xl font-bold">@{profileData.username}</p>

                  <SecondaryButton onClick={handleEditProfile}>
                    Editar Perfil
                  </SecondaryButton>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-6 sm:p-4 justify-center md:justify-start text-gray-600">
                  <button onClick={() => handleToggleView("events")}>
                    <span className="hover:text-red-700">
                      {events.length} Eventos
                    </span>
                  </button>
                  <button onClick={() => handleToggleView("posts")}>
                    <span className="hover:text-red-700">
                      {posts.length} Publicaciones
                    </span>
                  </button>
                  <p>
                    <span>{profileData.followers?.length || 0} Seguidores</span>
                  </p>
                  <p>
                    <span>{profileData.following?.length || 0} Siguiendo</span>
                  </p>
                </div>
                <div className="mt-4 text-center md:text-left">
                  <p className="font-semibold mb-2">{profileData.fullName}</p>
                  <p className="text-gray-600 mb-2">
                    {<FontAwesomeIcon icon={faAudioDescription} />}{" "}
                    {profileData.bio}
                  </p>
                  <p className="text-gray-600">
                    {<FontAwesomeIcon icon={faLocationDot} />}{" "}
                    {profileData.location}
                  </p>
                </div>

                {profileData.bikeDetails ? (
                  <div className="mt-4 ">
                    <h2 className="text-lg font-semibold sm:text-center">
                      Detalles de la Moto
                    </h2>
                    <p className="text-gray-600">
                      Marca:{" "}
                      {profileData.bikeDetails.brand || "No especificado"}
                    </p>
                    <p className="text-gray-600">
                      Modelo:{" "}
                      {profileData.bikeDetails.model || "No especificado"}
                    </p>
                    <p className="text-gray-600">
                      Año: {profileData.bikeDetails.year || "No especificado"}
                    </p>
                    <p className="text-gray-600">
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

                {missingFields.length > 0 && (
                  <div className="mt-4 text-red-700">
                    <p>
                      Parece que te falta completar tu{" "}
                      {missingFields.join(", ")}. ¡Haz clic en{" "}
                      <span className="font-semibold"> Editar Perfil</span>
                      para completar esos datos!
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleView("posts")}
                  className={`border-2 border-red-700 font-medium px-4 py-2 w-full text-center rounded${
                    view === "posts"
                      ? " bg-red-700 text-white transition-all duration-300 shadow-lg rounded-2xl hover:bg-red-800 hover:border-red-800  hover:rounded-2xl hover:text-white"
                      : " text-red-700 transition-all duration-300 rounded-xl hover:bg-red-700 hover:text-white hover:rounded-2xl"
                  }`}
                >
                  Publicaciones
                </button>
                <button
                  onClick={() => handleToggleView("events")}
                  className={`border-2 border-red-700 font-medium px-4 py-2 w-full text-center rounded${
                    view === "events"
                      ? "  bg-red-700 text-white transition-all duration-300 shadow-lg rounded-2xl hover:bg-red-800 hover:border-red-800  hover:rounded-2xl hover:text-white"
                      : "  text-red-700 transition-all duration-300 rounded-xl hover:bg-red-700 hover:text-white hover:rounded-2xl"
                  }`}
                >
                  Eventos
                </button>
              </div>
            </div>
            <div className="mt-6">
              {view === "posts" ? (
                posts.length === 0 ? (
                  <div className="mt-4 text-center p-4 flex justify-center items-center flex-col gap-3">
                    <p className="text-gray-600">
                      Aún no tienes publicaciones.
                    </p>
                    <PrimaryButton onClick={() => navigate("/create/post")}>
                      Crear Publicación
                    </PrimaryButton>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        onClick={() => handleShowPost(post._id)}
                        className="cursor-pointer border rounded shadow-md"
                      >
                        <img
                          src={`http://localhost:5000/${post.media}`}
                          alt="Post"
                          className="w-full h-48 object-cover rounded-t"
                        />
                        <div className="w-full px-4 ">
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
                                  categoryStyles[post.category.toLowerCase()] ||
                                  categoryStyles.otros
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
                        <div className="p-4 flex justify-between items-center ">
                          <PrimaryButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdatePost(post._id);
                            }}
                          >
                            Editar
                          </PrimaryButton>
                          <SecondaryButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePost(post._id);
                            }}
                          >
                            Eliminar
                          </SecondaryButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : events.length === 0 ? (
                <div className="mt-4 text-center p-4 flex justify-center items-center flex-col gap-3">
                  <p className="text-gray-600">Aún no tienes eventos.</p>
                  <div>
                    <PrimaryButton onClick={() => navigate("/create/event")}>
                      Crear Evento
                    </PrimaryButton>
                  </div>
                </div>
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
                      <div className="w-full px-4 ">
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
                                categoryStyles[event.category.toLowerCase()] ||
                                categoryStyles.otros
                              }`}
                            >
                              {event.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center ">
                        <PrimaryButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateEvent(event._id);
                          }}
                        >
                          Editar
                        </PrimaryButton>
                        <SecondaryButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event._id);
                          }}
                        >
                          Eliminar
                        </SecondaryButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
