const express = require("express");
const router = express.Router();

// importiamo il controller
const postsController = require("../controllers/postsController");

// INDEX → GET /posts
router.get("/", postsController.index);

// SHOW → GET /posts/:id
router.get("/:id", postsController.show);

// CREATE → POST /posts
router.post("/", postsController.store);

// UPDATE → PUT /posts/:id
router.put("/:id", postsController.update);

// DELETE → DELETE /posts/:id
router.delete("/:id", postsController.destroy);


module.exports = router;