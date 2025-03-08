import { Schema, model } from "mongoose";

const ProductSchema = Schema({
    name: {
        type: String,
        unique: [true, "El producto ya existe"],
        required: [true, "El nombre del producto es requerido"],
        maxLenght: [25, "El maximo permitido son 25 caracteres"],
    },
    description: {
        type: String,
        maxLenght: [200, "El maximo permitido son 200 caracteres"],
    },
    stock:{
        type: Number,
        default: 0
    },
    sold:{
        type: Number,
        default: 0
    },
    price:{
        type: Number,
        required: [true,"El precio es requerido"],
        default: 0
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    } 
},
{
    timestamps: true,
    versionKey: false
});

export default model('Product', ProductSchema)    