import { response, request } from "express"
import User from './user.model.js'
import { hash } from "argon2";
import argon2 from 'argon2';

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0} = req.query;
        const query = { estado: true};

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuario',
            error
        })
    }
}

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, email, ...data } = req.body;
        
        if(data.password) {
            data.password = await hash(data.password)
        }
        
        const user = await User.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            succes: true,
            msg: 'Usuario Actualizado',
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error
        })
    }
}  

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        const validPassword = await argon2.verify(user.password, password);

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                msg: "Contraseña incorrecta"
            });
        }

        user.estado = false;
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Usuario desactivado correctamente",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al desactivar usuario",
            error
        });
    }
};