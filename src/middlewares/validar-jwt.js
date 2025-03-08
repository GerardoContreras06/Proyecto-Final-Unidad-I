import jwt from 'jsonwebtoken';
import Usuario from '../users/user.model.js';

export const validarJWT = async (req, res, next) => {

    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: "No hay token en la peticion"
        })
    }

    try {
        
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: 'Usuario no existe en la base de datos'
            })
        }

        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - usuarios con estado: false'
            })
        }

        req.usuario = usuario;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token no valido"
        })
    }
}

export const esAdminRole = (req, res, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: "Se quiere verificar el rol sin validar el token primero"
        });
    }

    if (req.usuario.role !== "ADMIN_ROLE") {
        return res.status(403).json({
            msg: "No tienes el rol de Administrador para realizar esta acción"
        });
    }

    next();
};

export const esPropietario = (req, res, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: "Se quiere verificar el usuario sin validar el token primero",
        });
    }

    if (req.usuario.id !== req.params.id) {
        return res.status(403).json({
            msg: "No eres el dueño de esta cuenta para realizar esta acción",
        });
    }

    next();
};
