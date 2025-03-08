import { Router } from "express";
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js'
import { createCategory, getCategories, updateCategory, deleteCategory } from "./category.controller.js";
import { existeCategoriaById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT, esAdminRole } from '../middlewares/validar-jwt.js'
import { check } from "express-validator";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        esAdminRole,
        validarCampos,
        deleteFileOnError
    ],
    createCategory
)

router.get(
    "/",
    [
        validarJWT,
        esAdminRole
    ],
    getCategories
);

router.put(
    "/:id",
    [
        validarJWT,
        esAdminRole,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCategoriaById),
        validarCampos,
        deleteFileOnError
    ],
    updateCategory
)

router.delete(
    "/:id",
    [
        validarJWT,
        esAdminRole,
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeCategoriaById),
        validarCampos,
        deleteFileOnError
    ],
    deleteCategory
)

export default router;