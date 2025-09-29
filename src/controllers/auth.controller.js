import { comparePassword, hashPassword } from "../helpers/bcrypt.helper.js";
import { signToken } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/mongoose/user.model.js";

export const register = async (req, res) => {
  const { username, email, password, role, profile } = req.body;
  const hashedPassword = await hashPassword(password);
  try {
    // TODO: crear usuario con password hasheada y profile embebido
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role,
      profile: {
        employee_number,
        first_name,
        last_name,
        phone,
      },
    });
    return res
      .status(201)
      .json({ msg: "Usuario registrado correctamente", newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // TODO: buscar user, validar password, firmar JWT y setear cookie httpOnly
    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: "Credenciales invalidas" });
    }
    const validarPassword = await comparePassword(password, user.password);
    if (!validarPassword) {
      return res
        .status(401)
        .json({ ok: false, message: "credenciales invalidas" });
    }
    const token = signToken({
      _id: user._id,
      name: user.profile.first_name,
      lastname: user.profile.last_name,
      role: user.role,
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hora
    });
    return res.status(200).json({ msg: "Usuario logueado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getProfile = async (req, res) => {
  try {
    // TODO: devolver profile del user logueado actualmente
    const data = req.user;

    const profile = await UserModel.findById(data._id);
    // .select("profile username _id");
    if (!profile) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }
    return res.status(200).json({ data: profile });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const logout = async (_req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ msg: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error interno del servidor" });
  }
};

// POST /api/auth/register: Registro con creación automática de profile (público)
// ● POST /api/auth/login: Login con JWT en cookie (público)
// ● GET /api/auth/profile: Obtener profile del usuario autenticado (usuario autenticado)
// ● POST /api/auth/logout: Logout limpiando cookie (usuario autenticado)
