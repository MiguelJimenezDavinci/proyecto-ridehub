import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú en móvil

  const { logout } = useAuth(); // Importar la función de cierre de sesión
  // Función para manejar el toggle del menú
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-100 border border-gray-200 dark:border-gray-700 px-4 sm:px-8 py-3 dark:bg-gray-800 shadow absolute top-0 left-0 right-0 z-50 ">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link to="/" className="flex items-center">
          <img
            src="../ridehub-logo-1.png"
            className="h-10 sm:h-12"
            alt="RideHub Logo"
          />
        </Link>
        {/* Botón de menú para móviles */}
        <button
          type="button"
          onClick={toggleMenu} // Cambiar el estado al hacer clic
          className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        {/* Menú para dispositivos móviles */}
        <div
          className={`w-full md:block md:w-auto ${isOpen ? "block" : "hidden"}`}
          id="mobile-menu"
        >
          <ul className="flex flex-col md:flex-row md:space-x-6">
            <li>
              <Link
                to="/"
                className="block py-2 text-gray-700 hover:text-red-700 dark:text-gray-400 dark:hover:text-white"
              >
                Inicio
              </Link>
            </li>

            <li>
              <Link
                to="/search"
                className="block py-2 text-gray-700 hover:text-red-700 dark:text-gray-400 dark:hover:text-white"
              >
                Buscador
              </Link>
            </li>
            <li>
              <Link
                to="/create"
                className="block py-2 text-gray-700 hover:text-red-700 dark:text-gray-400 dark:hover:text-white"
              >
                Crear
              </Link>
            </li>
            <li>
              <Link
                to="/posts"
                className="block py-2 text-gray-700 hover:text-red-700 dark:text-gray-400 dark:hover:text-white"
              >
                Publicaciones
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="block py-2 text-gray-700 hover:text-red-700 dark:text-gray-400 dark:hover:text-white"
              >
                Mi Perfil
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="block py-2 text-gray-700 hover:text-red-700 dark:text-gray-400 dark:hover:text-white"
              >
                Cerrar Sesión
              </button>

            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
