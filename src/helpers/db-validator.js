import User from '../users/user.model.js';
import Category from '../categories/category.model.js';
import Product from '../products/product.model.js';
import Bill from '../bills/bill.model.js';

export const existenteEmail = async (correo = ' ') => {

    const existeEmail = await User.findOne({ correo });

    if(existeEmail){
        throw new Error(`El correo ${ correo } ya existe en la base de datos`);
    }
}

export const existeUsuarioById = async (id = '') => {
    
    const existeUsuario = await User.findById(id);

    if(!existeUsuario){
        throw new Error(`El ID ${id} no existe`);
    }
}

export const existeCategoriaById = async (id = '') => {

    const existeCategoria = await Category.findById(id);

    if(!existeCategoria){
        throw new Error(`El ID ${id} no existe`);
    }
}

export const existeProductoById = async (id = '') => {

    const existeProducto = await Product.findById(id);

    if(!existeProducto){
        throw new Error(`El ID ${id} no existe`);
    }
}

export const existeFacturaById = async (id = '') => {

    const existeFactura = await Bill.findById(id);

    if(!existeFactura){
        throw new Error(`El ID ${id} no existe`);
    }
}