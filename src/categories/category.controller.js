import { request, response } from 'express';
import Category from './category.model.js';
import Product from '../products/product.model.js'

export const getCategories = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0} = req.query;
        const query = { estado: true};

        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            categories
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener las categorias',
            error
        })
    }
}

export const createCategory = async (req, res) => {
    try {
        const data = req.body;

        const category = new Category({
            ...data
        });

        await category.save();

        res.status(200).json({
            success: true,
            category
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar la categoria',
            error
        })
    }
}

export const updateCategory = async (req, res = response) => {
    try {
        const { id } = req.params;
        const {_id, ...data} = req.body;

        const category = await Category.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: 'Categoria Actualizada',
            category
        })

    }catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la categoria',
            error
        })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categoryToDelete = await Category.findById(id);
        if (!categoryToDelete) {
            return res.status(404).json({
                success: false,
                msg: "Categoría no encontrada",
            });
        }

        let defaultCategory = await Category.findOne({ name: "Sin categoría" });

        if (!defaultCategory) {
            defaultCategory = await Category.create({ name: "Sin categoría" });
        }

        await Product.updateMany(
            { category: categoryToDelete._id },
            { category: defaultCategory._id }
        );

        const category = await Category.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true }
        );

        res.status(200).json({
            success: true,
            msg: "Categoría desactivada y productos reasignados correctamente",
            category,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al desactivar la categoría",
            error,
        });
    }
};