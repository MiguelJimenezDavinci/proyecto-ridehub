import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../src/assets/fontAwesomeConfig";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/Landingpage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";

import SearchProfile from "./pages/SearchProfile";

import Create from "./pages/Create";
import CreateEvent from "./components/CreateEvent";
import CreatePost from "./pages/CreatePost";

import Posts from "./pages/Posts";
import UpdatePost from "./pages/PostUpdate";
import PostShow from "./pages/PostShow";

import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import ProfileEdit from "./pages/ProfileEdit";

import ShowEvents from "./pages/EventsShow";
import EventUpdate from "./components/UpdateEvent";

import Chat from "./pages/Chat";
import ChatPrivate from "./pages/ChatPrivate";

import "leaflet/dist/leaflet.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas protegidas */}
          {/* Inicio */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
                <Home />
              </ProtectedRoute>
            }
          />
          {/* Buscador */}
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Navbar />
                <SearchProfile />
              </ProtectedRoute>
            }
          />
          {/* Creacion de Posteos y Eventos */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <Navbar />
                <Create />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create/event"
            element={
              <ProtectedRoute>
                <Navbar />
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create/post"
            element={
              <ProtectedRoute>
                <Navbar />
                <CreatePost />
              </ProtectedRoute>
            }
          />
          {/* Publicaciones */}
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <Navbar />
                <Posts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <PostShow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-post/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <UpdatePost />
              </ProtectedRoute>
            }
          />
          {/* Eventos */}

          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <ShowEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-event/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <EventUpdate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Navbar />
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <Navbar />
                <ProfileEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <Navbar />
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/private/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <ChatPrivate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-profiles"
            element={
              <ProtectedRoute>
                <Navbar />
                <SearchProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <UserProfile />
              </ProtectedRoute>
            }
          />
          {/* Rutas públicas */}
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={
              <>
                <Login />
                <Footer />
              </>
            }
          />
          <Route path="/landing" element={<LandingPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
