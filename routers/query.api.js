const express = require("express");
const router = express.Router();
const queryController = require("../controllers/query.controller");

router.post("/", 
    queryController.setQuery
);

router.get("/", 
    queryController.getQueries
);

module.exports = router;