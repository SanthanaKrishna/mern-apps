import { Schema, model } from 'mongoose';


//Create Schema
const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

export const Item = model('Item', ItemSchema);
