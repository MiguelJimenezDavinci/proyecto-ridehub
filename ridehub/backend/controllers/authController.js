import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs"; // Asegúrate de importar fs
import path from "path";

// Registro de usuario
export const register = async (req, res) => {
  const { username, email, password, fullName } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
    });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro", error });
  }
};

// Autenticación de usuario
export const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Verificar si el usuario existe por email o nombre de usuario
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Crear y firmar el token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Enviar respuesta con el token y los detalles del usuario
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        email: user.email,
        location: user.location,
        bikeDetails: user.bikeDetails,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error("Error en la autenticación:", error);
    res
      .status(500)
      .json({ message: "Error en la autenticación", error: error.message });
  }
};

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Excluye la contraseña
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

// Obtener perfil de usuario
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Excluye la contraseña
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Extraemos los datos del cuerpo de la solicitud
    const { username, email, fullName, bio, location, bikeDetails } = req.body;

    // Validaciones básicas
    if (!username || !email || !fullName) {
      return res.status(400).json({ message: "Faltan campos requeridos." });
    }

    // Verificamos que bikeDetails tenga la estructura esperada
    let bikeDetailsData = null;
    if (bikeDetails) {
      const { brand, model, year, licensePlate } = bikeDetails;
      if (!brand || !model || !year || !licensePlate) {
        return res.status(400).json({ message: "Faltan detalles de la moto." });
      }
      // Aseguramos que bikeDetails sea un objeto con las propiedades correctas
      bikeDetailsData = { brand, model, year, licensePlate };
    }

    const updateData = {
      username,
      email,
      fullName,
      bio,
      location,
      ...(bikeDetailsData && { bikeDetails: bikeDetailsData }), // Solo agrega bikeDetails si existe
    };

    // Si hay un archivo de imagen, agrega la propiedad photo
    if (req.file) {
      updateData.photo = req.file.filename; // Guarda el nombre del archivo
    }

    // Actualiza el usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.status(200).json({
      message: "Perfil actualizado correctamente.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el perfil." });
  }
};

// Eliminar cuenta de usuario
export const deleteAccount = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Cuenta eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la cuenta" });
  }
};
