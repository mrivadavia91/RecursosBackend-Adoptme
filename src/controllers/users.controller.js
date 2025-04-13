
import UserModel from '../dao/models/User.js';

export const uploadDocuments = async (req, res) => {
  try {
    const { uid } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No se subieron archivos' });
    }

    const documentEntries = files.map(file => ({
      name: file.originalname,
      reference: file.path,
    }));

    const user = await UserModel.findById(uid);
    if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

    user.documents.push(...documentEntries);
    await user.save();

    res.json({ status: 'success', message: 'Documentos subidos correctamente', documents: user.documents });
  } catch (error) {
    console.error('Error al subir documentos:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};
