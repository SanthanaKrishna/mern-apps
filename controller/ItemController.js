import { Item } from '../models/Item';


/**
 * @route ['GET'] api/items
 * @description Get All Items
 * @access Public
 */
export const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        if (!items) throw Error('No items');
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @route ['POST'] api/items
 * @description create an Item
 * @access Private
 */
export const postItem = async (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });
    try {
        const item = await newItem.save();
        if (!item) throw Error('Something went wrong saving the item');

        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


/**
 * @route ['DELETE'] api/items/:id
 * @description Delete a Item
 * @access Private
 */
export const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) throw Error('No item found');

        const removed = await item.remove();
        if (!removed) {
            throw Error('Something went wrong while trying to delete the item');
        }
        res.status(200).json({ success: true });

    } catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
};
