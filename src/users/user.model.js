import { Schema, model } from "mongoose";

const UserSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "El nombre es requerido"],
            maxLength: [25, "El maximo permitido son 25 caracteres"],
        },
        surname: {
            type: String,
            required: [true, "El apellido es requerido"],
            maxLength: [25, "El maximo permitido son 25 caracteres"],
        },
        email: {
            type: String,
            required: [true, "El correo es requerido"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "La contraseña es requerida"],
            minLength: 8,
        },
        phone: {
            type: String,
            minLength: 8,
            maxLength: 8,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: [ "ADMIN_ROLE", "USER_ROLE" ],
            default: "USER_ROLE"
        },
        estado: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('User', UserSchema);