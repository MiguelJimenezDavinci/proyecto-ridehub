import SupportRequest from "../models/SupportRequest.js";

// Crear solicitud de soporte
export const createSupportRequest = async (req, res) => {
  const { requestType } = req.body;

  const supportRequest = new SupportRequest({
    user: req.user.id,
    requestType,
  });

  try {
    await supportRequest.save();
    res.status(201).json(supportRequest);
  } catch (error) {
    res.status(400).json({ error: "Error al crear la solicitud de soporte" });
  }
};

// Obtener todas las solicitudes de soporte del usuario
export const getUserSupportRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find({ user: req.user.id });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener solicitudes de soporte" });
  }
};
