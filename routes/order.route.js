const express = require('express');
const router = express.Router();
const Order = require('../models/order.js');
//Add new order
router.post('/', async (req, res) => {
const commandeData = req.body;
try{
    const mtcmd = commandeData.lineOrder.reduce((acc, lc) => acc +lc.totalPrice, 0);
const newOrder = new Order({
client: commandeData.client,
total: parseFloat(mtcmd).toFixed(3),
status:'Not processed',
lineOrder: commandeData.lineOrder.map((lc) => ({
articleID: lc.articleID,
quantity: lc.quantity,
totalPrice: lc.totalPrice
})),
});
await newOrder.save();
res.status(200).json({ message: 'sucess' ,order : newOrder});
} catch (error) {
console.error(error);
res.status(409).json({ message: error.message });
}
});


// afficher la liste des commandes.
router.get('/', async (req, res, )=> {
try {
const orders = await Order.find({}, null, {sort: {'_id': -
1}}).populate("lineOrder.articleID").exec();
res.status(200).json(orders);
} catch (error) {
res.status(404).json({ message: error.message });
}
});

// modifier état commande
router.put('/:id', async (req, res) => {
const newStatus = req.body.status;
const orderId=req.params.id;
if (!['Not processed', 'Processing', 'Shipped', 'Delivered',
'Cancelled'].includes(newStatus)) {
res.status(403).json({ message: 'Invalid status value' }); return;
}
try {
const orderUpdated = await Order.findByIdAndUpdate(
orderId,
{ status: newStatus },
{ new: true } // Return the updated document
);
if (!orderUpdated) {
return res.status(404).json({ message: 'Order not found' });
}
res.status(200).json(orderUpdated);
} catch (error) {
res.status(404).json({ message: error.message });
}
});

// Supprimer une commande
router.delete('/:id', async (req, res)=> {
const id = req.params.id;
await Order.findByIdAndDelete(id);
res.json({ message: "Order deleted successfully." });
});



module.exports = router;