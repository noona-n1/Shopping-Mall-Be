const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authController = require("../controllers/auth.controller");


router.get("/", 
    productController.getProducts
);

router.post("/", 
    authController.authenticate,
    productController.createProduct
);

router.put("/:id", 
    authController.authenticate,
    productController.updateProduct
);

router.delete("/:id", 
    authController.authenticate,
    productController.deleteProduct
);

module.exports = router;
