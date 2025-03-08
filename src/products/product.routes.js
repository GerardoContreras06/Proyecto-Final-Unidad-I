import { Router } from "express";
import { check } from "express-validator";
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js';
import { createProduct, updateProduct, deleteProduct, getProductsSinCategoria, getProducts, getProductById,getProductsSinStock, getTopProducts, getProductByName } from "./product.controller.js";
import { existeProductoById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT, esAdminRole } from '../middlewares/validar-jwt.js';

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        esAdminRole,
        check('name', 'Este no es un nombre valido').not().isEmpty(),
        validarCampos,
        deleteFileOnError
    ],
    createProduct
)

router.put(
    "/:id",
    [
        validarJWT,
        esAdminRole,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeProductoById),
        validarCampos,
        deleteFileOnError
    ],
    updateProduct
)

router.delete(
    "/:id",
    [
        validarJWT,
        esAdminRole,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos,
        deleteFileOnError
    ],
    deleteProduct
)

router.get(
    "/sinCategoria",
    [
        validarJWT,
        esAdminRole
    ],
    getProductsSinCategoria
);

router.get(
    "/",
    [
        validarJWT,
        esAdminRole
    ],
    getProducts
)

router.get(
    "/findProduct/:id",
    [
        validarJWT,
        esAdminRole,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeProductoById),
        validarCampos
    ],
    getProductById
)

router.get(
    "/sinStock",
    [
        validarJWT,
        esAdminRole,
        validarCampos
    ],
    getProductsSinStock
)

router.get(
    "/topProducts",
    [
        validarJWT,
        validarCampos
    ],
    getTopProducts
)

router.get(
    "/name/:name",
    [
        validarJWT,
        validarCampos
    ],
    getProductByName
)

export default router;