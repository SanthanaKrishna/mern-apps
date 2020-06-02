const express = require('express');
const router = express.Router();

const ItemController = require('../controller/ItemController');


router.get('/', ItemController.getItems);
router.post('/', ItemController.postItem);
router.delete('/:id', ItemController.deleteItem);

module.exports = router;