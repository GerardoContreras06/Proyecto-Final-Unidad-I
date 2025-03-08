import { Schema, model } from "mongoose";

const CategorySchema = Schema({
    name: {
        type: String,
        unique: [true, "La categoria ya existe"],
        required: [true, "El nombre de la categoria es requerido"],
        maxLength: [25, "El maximo permitido son 25 caracteres"],
    },
    estado: {
        type: Boolean,
        default: true,
    } 
},
{
    timestamps: true,
    versionKey: false
});

export default model('Category', CategorySchema)