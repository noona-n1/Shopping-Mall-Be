const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authController = require("../controllers/auth.controller");

router.post("/", 
    authController.authenticate, 
    orderController.createOrder
);

router.get("/", 
    authController.authenticate, 
    orderController.getOrders
);

router.get("/admin", 
    authController.authenticate,
    // authController.checkAdminPermission,
    orderController.getAdminOrders
);

router.put("/:id", 
    authController.authenticate,
    // authController.checkAdminPermission,
    orderController.updateOrder
);

module.exports = router;