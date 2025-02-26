import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importamos FontAwesome
import { faPlus } from "@fortawesome/free-solid-svg-icons"; // Ícono de +

const Create = () => {
  const navigate = useNavigate();

  const handlePostCreation = () => {
    navigate("/create/post"); // Redirige a la vista para crear publicaciones
  };

  const handleEventCreation = () => {
    navigate("/create/event"); // Redirige a la vista para crear eventos
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center h-screen">
      <div className="flex flex-col sm:flex-row w-full h-full sm:w-full">
        {/* Imagen a la parte superior en móviles y a la derecha en pantallas grandes */}
        <div className="sm:w-1/2 xl:w-5/6 sm:order-2">
          <img
            src="../rider-1.jpg"
            alt="Rider"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contenedor de los botones */}
        <div className="bg-white px-4 sm:p-16 mt-12 sm:mt-12 w-full sm:w-1/2 rounded-lg shadow-md flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold text-center">Crear Nuevo</h2>
          <p className="text-center text-gray-700">
            Selecciona una opción para crear un nuevo evento o publicación.
          </p>

          <div className="space-y-4 w-full">
            <button
              onClick={handleEventCreation}
              className="flex items-center justify-center w-full p-8 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-900 transition"
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="text-white h-8 w-8 mr-4"
              />
              Crear Evento
            </button>

            <button
              onClick={handlePostCreation}
              className="group flex items-center justify-center w-full p-8 border-2 border-red-700 text-red-700 font-semibold rounded-lg hover:bg-red-700 hover:text-white transition"
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="text-red-700 h-8 w-8 mr-4 transition-colors group-hover:text-white"
              />
              Crear Publicación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
