import { response } from 'express';
import Product from '../products/product.model.js';
import Bill from './bill.model.js';

export const createBill = async (req, res) => {
    try {
        const { name, surname, email, client, cart } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "El carrito de compras está vacío",
            });
        }

        let totalAmount = 0;
        const purchasedProducts = [];

        for (const item of cart) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    msg: `Producto con ID ${item.productId} no encontrado`,
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    msg: `Stock insuficiente para el producto: ${product.name}`,
                });
            }

            product.stock -= item.quantity;
            await product.save();

            totalAmount += product.price * item.quantity;
            purchasedProducts.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                subtotal: product.price * item.quantity,
            });
        }

        const newBill = await Bill.create({
            name,
            surname,
            email,
            client,
            total: purchasedProducts,
            estado: true,
        });

        res.status(201).json({
            success: true,
            msg: "Factura creada con éxito",
            bill: newBill,
            totalAmount,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al crear la factura",
            error: error.message,
        });
    }
};

export const createPurchase = async (req, res) => {
    try {
        const { client, products } = req.body;
        
        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "Debe agregar productos al carrito antes de realizar la compra."
            });
        }

        let totalAmount = 0;
        let productList = [];

        for (const item of products) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    msg: `El producto con ID ${item.productId} no existe.`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    msg: `No hay suficiente stock para el producto ${product.name}. Disponible: ${product.stock}`
                });
            }

            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;

            product.stock -= item.quantity;
            product.sold += item.quantity;
            await product.save();

            productList.push({
                productId: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                subtotal
            });
        }

        const bill = new Bill({
            name: client.name,
            surname: client.surname,
            email: client.email,
            client: client.id,
            total: productList,
            estado: true
        });

        await bill.save();

        return res.status(201).json({
            success: true,
            msg: "Compra realizada con éxito.",
            bill
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al procesar la compra",
            error
        });
    }
};

export const getPurchaseHistory = async (req, res) => {
    try {
        const userId = req.usuario._id;

        const purchases = await Bill.find({ client: userId });

        if (!purchases || purchases.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "No tienes compras registradas."
            });
        }

        res.status(200).json({
            success: true,
            msg: "Historial de compras obtenido con éxito.",
            purchases
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener el historial de compras",
            error
        });
    }
};

export const updateBill = async (req, res) => {
    try {
        const { id } = req.params;
        const { total } = req.body;

        const existingBill = await Bill.findById(id);
        if (!existingBill) {
            return res.status(404).json({
                success: false,
                msg: "Factura no encontrada",
            });
        }

        for (const item of total) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    msg: `El producto con ID ${item.productId} no existe`,
                });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    msg: `Stock insuficiente para el producto: ${product.name}`,
                });
            }
        }

        const updatedBill = await Bill.findByIdAndUpdate(id, { total }, { new: true });

        res.status(200).json({
            success: true,
            msg: "Factura actualizada con éxito",
            updatedBill,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar la factura",
            error,
        });
    }
};

export const getBillsByUser = async (req, res) => {
    try {
        const { userId } = req.params; 

        const bills = await Bill.find({ client: userId });

        if (!bills.length) {
            return res.status(404).json({
                success: false,
                msg: "No hay facturas para este usuario",
            });
        }

        res.status(200).json({
            success: true,
            msg: "Facturas encontradas",
            bills,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener las facturas",
            error,
        });
    }
};