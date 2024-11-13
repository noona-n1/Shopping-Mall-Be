const Product = require("../models/Product");

const productController = {};

productController.createProduct = async (req, res) => {
    try {
        const { sku, name, image, category, description, price, stock, brand } = req.body;

        const newProduct = new Product({sku, name, image, category, description, price, stock, brand});

        await newProduct.save();

        return res.status(200).json({status: "success", data: newProduct});
    } catch (error) {
        return res.status(400).json({status: "fail", error: error.message});
    }
}

productController.getProducts = async (req, res) => {
    try {
        const {page, name, limit} = req.query;
        const cond = name ? {name: {$regex: name, $options: "i"}} : {};
        let query = Product.find(cond);
        
        if(page) {
            query = query.skip((page - 1) * limit).limit(limit);

            const total = await Product.find(cond).countDocuments();
            const totalPages = Math.ceil(total / limit);

            response.page = page;
            response.totalCount = total;
            response.totalPageNum = totalPages;
        }

        const products = await query.exec();

        response.products = products;

        res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({status: "fail", error: error.message});
    }
}

module.exports = productController;