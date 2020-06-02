// Item Model
const Item = require('../models/Item');


/**
 * @route['GET'] api/items
 * @description Get All Items
 * @access Public
 */
const getItems = (req, res) => {
    Item.find()
        .sort({ date: -1 })
        .then(items => res.json(items))
};

/**
 * @route['POST'] api/items
 * @description create an Item
 * @access Public
 */
const postItem = (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });
    newItem.save().then(item => res.json(item));
};


/**
 * @route['DELETE'] api/items/:id
 * @description Delete a Item
 * @access Public
 */
const deleteItem = (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }))
};

exports.getItems = getItems;
exports.postItem = postItem;
exports.deleteItem = deleteItem;