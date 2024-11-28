import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLocationDot,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { getEvents } from "../service/events";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/Button/PrimaryButton";
import SecondaryButton from "../components/Button/SecondaryButton";

const EventMap = () => {
  const [isListVisible, setIsListVisible] = useState(false);
  const [eventos, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  const categoryStyles = {
    encuentro: "bg-red-200 text-red-800",
    competencia: "bg-blue-200 text-blue-800",
    rally: "bg-green-200 text-green-800",
    exhibición: "bg-yellow-200 text-yellow-800",
    otros: "bg-gray-200 text-gray-800",
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los eventos. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  const handleEventShow = (event) => {
    setSelectedEvent(event);
    navigate(`/events/${event._id}`);
  };

  const MapFlyTo = ({ event }) => {
    const map = useMap();

    useEffect(() => {
      if (event && map) {
        map.flyTo([event.latitude, event.longitude], 15);
      }
    }, [event, map]);

    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-red-700"
          role="status"
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-700">{error}</p>;
  }

  if (eventos.length === 0) {
    return <p className="text-center">No hay eventos disponibles.</p>;
  }

  return (
    <div className="flex fixed z-0 h-screen w-full">
      {isListVisible && (
        <div className="md:w-9/12 sm:w-full bg-white shadow-lg mt-16">
          <div className="h-full overflow-y-auto p-4">
            {eventos.map((event) => (
              <div
                key={event._id}
                className="border-b py-2 px-3 flex flex-col text-sm w-full"
              >
                <div
                  onClick={() => setSelectedEvent(event)}
                  className="cursor-pointer border rounded shadow-md w-full"
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
                            categoryStyles[event.category.toLowerCase()] ||
                            categoryStyles.otros
                          }`}
                        >
                          {event.category}
                        </span>
                      )}

                      <div className="mt-2 flex justify-end">
                        <PrimaryButton
                          onClick={() => handleEventShow(event)}
                          className="mt-4"
                        >
                          Ver más
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className=" fixed bottom-16 left-1/2 z-50">
        <SecondaryButton onClick={toggleListVisibility}>
          {isListVisible ? "Ocultar eventos" : "Mostrar eventos"}
        </SecondaryButton>
      </div>
      <MapContainer
        center={[-34.5937, -58.4416]}
        zoom={12}
        className="mt-16 h-screen w-full z-0"
      >
        <TileLayer
          url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlndWVsamltZW5leiIsImEiOiJjbTNtYm1zZzUxMDJhMmpwcm51b3hna2RkIn0.9QKStVrjBehwt8j5GbyGig"
          id="mapbox/streets-v9"
          tileSize={512}
          zoomOffset={-1}
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {eventos.map((event) => (
          <Marker key={event._id} position={[event.latitude, event.longitude]}>
            <Popup
              closeButton={true}
              autoClose={true}
              closeOnClick={true}
              autoPan={true}
              className=""
            >
              <div
                onClick={() => handleEventShow(event)}
                className=" cursor-pointer"
              >
                <img
                  src={`http://localhost:5000/${event.image}`}
                  alt={event.title}
                  className="h-36 w-full object-cover object-center m-0"
                />
                <p className="font-bold">{event.title}</p>
                <p className="text-gray-500">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-xs">
                  <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                  {(event.location.length > 30 &&
                    `${event.location.substring(0, 30)}...`) ||
                    event.location}
                </p>
                <p className="text-gray-500">
                  <FontAwesomeIcon icon={faUser} className="mr-1" />
                  {event.participants.length}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        {selectedEvent && <MapFlyTo event={selectedEvent} />}
      </MapContainer>
    </div>
  );
};

EventMap.propTypes = {
  eventos: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      participants: PropTypes.array.isRequired,
      category: PropTypes.string,
      image: PropTypes.string.isRequired,
    })
  ),
};

export default EventMap;
