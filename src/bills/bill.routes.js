import { Router } from "express";
import { check } from "express-validator";
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js';
import { createBill, createPurchase, getPurchaseHistory, updateBill, getBillsByUser } from "./bill.controller.js";
import { existeFacturaById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT, esAdminRole } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        validarCampos,
        deleteFileOnError
    ],
    createBill
)

router.post(
    "/purchase",
    [
        validarJWT,
        validarCampos,
        deleteFileOnError
    ],
    createPurchase
)

router.get(
    "/",
    [
        validarJWT
    ],
    getPurchaseHistory
)

router.put(
    "/:id",
    [
        validarJWT,
        esAdminRole,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeFacturaById),
        validarCampos,
        deleteFileOnError
    ],
    updateBill
)

router.get(
    "/findBill/:id",
    [
        validarJWT,
        esAdminRole,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos,
        deleteFileOnError
    ],
    getBillsByUser
)

export default router;