import { response } from 'express';
import Category from '../categories/category.model.js'
import Product from './product.model.js';

export const createProduct = async (req, res) => {
    try {
        const data = req.body;

        const category = await Category.findOne({ name: data.category });

        if(!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoria no encontrada'
            });
        }

        const product = new Product({
            ...data,
            category: category._id
        })

        await product.save();

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el producto',
            error
        });
    }
}   

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, category, ...data } = req.body;

        const productExist = await Product.findById(id);
        if (!productExist) {
            return res.status(404).json({
                success: false,
                msg: "Producto no encontrado",
            });
        }

        if (category) {
            const categoriaExiste = await Category.findOne({ name: category });

            if (!categoriaExiste) {
                return res.status(404).json({
                    success: false,
                    msg: "Categoría no encontrada",
                });
            }

            data.category = categoriaExiste._id;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Producto actualizado correctamente",
            product: updatedProduct,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el producto",
            error: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {

    const { id } = req.params;  

    try {

        await Product.findByIdAndUpdate(id, { estado: false });

        res.status(200).json({
            success: true,
            message: 'Producto eliminado exitosamente'
        })
        
    }catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el producto',
            error
        })
    }
}

export const getProductsSinCategoria = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0} = req.query;

        const defaultCategory = await Category.findOne({ name: "Sin categoría" });

        if (!defaultCategory) {
            return res.status(404).json({
                success: false,
                msg: "No se encontró la categoría predeterminada"
            });
        }

        const query = { estado: true, category: defaultCategory._id };

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            products
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener los productos',
            error
        })
    }
}

export const getProducts = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0} = req.query;
        const query = { estado: true};

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            products
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener las categorias',
            error
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({
                success: false,
                msg: 'Producto no encontrado'
            })
        }

        res.status(200).json({
            success: true,
            product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuario',
            error
        })
    }
}

export const getProductsSinStock = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query; 
        const query = { stock: 0, estado: true };

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener los productos sin stock",
            error
        });
    }
};

export const getTopProducts = async (req, res) => {
    try {
        
        const products = await Product.find({ sold: { $gt: 50 } })
            .sort({ sold: -1 }) 
            .limit(10); 

        res.status(200).json({
            success: true,
            total: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener los productos más vendidos",
            error: error.message
        });
    }
};

export const getProductByName = async (req, res) => {
    try {
        const { name } = req.params; 

        const product = await Product.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') }, estado: true });

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener el producto',
            error
        });
    }
};