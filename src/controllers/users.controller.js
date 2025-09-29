import { UserModel } from "../models/mongoose/user.model.js";


export const getAllUsers = async (_req, res) => {
  try {
    // TODO: devolver usuarios con profile y sus assets con sus categories (populate) (solo admin)
    const users = await UserModel.find()
      .populate("assets")
      .populate("categories");
    return res.status(200).json({ data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // TODO: eliminación lógica (deletedAt) (solo admin)
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }
    const deletedUser = await UserModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    return res.status(204).json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
