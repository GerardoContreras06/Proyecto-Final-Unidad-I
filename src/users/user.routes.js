import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, deleteUser } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT ,esAdminRole, esPropietario } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getUsers);

router.get(
    "/findUser/:id",
    [
        esAdminRole,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos,
    ],
    getUserById
)

router.put(
    "/updateAdmin/:id",
    [
        validarJWT,
        esAdminRole,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
)

router.put(
    "/updateOwner/:id",
    [
        validarJWT,
        esPropietario,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
)

router.delete(
    "/deleteAdmin/:id",
    [
        validarJWT,
        esAdminRole,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)

router.delete(
    "/deleteOwner/:id",
    [
        validarJWT,
        esPropietario,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)

export default router;  