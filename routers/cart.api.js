const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authController = require("../controllers/auth.controller");

router.post("/", 
    cartController.createCart
);

router.get("/", 
    cartController.getCart
);

router.get("/count", 
    cartController.getCartCount
);

router.delete("/:itemId", 
    cartController.deleteCartItem
);

router.put("/:itemId", 
    cartController.updateCartItem
);

module.exports = router;