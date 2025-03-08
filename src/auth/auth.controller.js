import Usuario from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT} from '../helpers/generate-jwt.js';

export const login = async(req, res) => {
    const {email, password} = req.body

    try {
        const lowerEmail = email ? email.toLowerCase() : null

        const user = await Usuario.findOne({
            $or: [{email: lowerEmail}]
        })

        if(!user){
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo no existe en la base de datos'
            })
        }

        if(!user.estado){
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            })
        }

        const validPassword = await verify(user.password,password)
        if(!validPassword){
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            })
        }

        const token = await generarJWT(user.id)
        res.status(200).json({
            msg: 'Logged in successfully!',
            userDetails:{
                username: user.username,
                token: token,
                profilePicture: user.profilePicture
            }
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Server error',
            error: e.message
        })
    }
}

export const register = async (req, res)=> {
    try {
        const data = req.body;

        const encryptedPassword = await hash (data.password);

        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            email: data.email,
            phone: data.phone,
            role: data.role || "USER_ROLE",
            password: encryptedPassword
        })

        return res.status(201).json({
            message: "User registered successfully",
            userDetails: {
                user: user.email
            }
        });

    }catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "User registration failed",
            error: error.message
        })
    }
}