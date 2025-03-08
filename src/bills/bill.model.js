import { Schema, model } from "mongoose";

const BillSchema = Schema({
    name: {
        type: String,
        required: [true, "El nombre del cliente es requerido"]
    },
    surname: {
        type: String,
        required: [true, "El apellido del cliente es requerido"]
    },
    email: {
        type: String,
        required: [true, "El correo del cliente es requerido"]
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "Usuario requerido"]
    },
    total: {
        type: [],
        required: [true, "Lista de los productos es requerido"]
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

export default model('Bill', BillSchema);