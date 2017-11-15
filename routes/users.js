const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/", (request, response) => {
	response.send("respond with a resource");
});

module.exports = router;
