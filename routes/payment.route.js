const express = require('express');
const router = express.Router();
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
router.post('/', async (req, res) => {
try {
const session = await Stripe.checkout.sessions.create({
payment_method_types: ["card"],
mode: "payment",
line_items: Object.values(req.body.cartDetails).map(item => ({
price_data: {
currency: "usd",
product_data: {
name: item.title,
images:[item.image]
},
unit_amount: item.price * 100,
},
quantity: item.quantity,
})),

success_url: `${process.env.CLIENT_URL}`,
cancel_url: `${process.env.CLIENT_URL}`,
})
res.json({ sessionId: session.id })
} catch (e) {
res.status(500).json({ error: e.message })
}
});
module.exports = router;
// route POST qui reçoit les détails du panier dans req.body.cartDetails
//crée une session de paiement Stripe Checkout avec ces articles,
//  puis renvoie l'ID de la session au client
// . Le client pourra ensuite utiliser cet ID pour rediriger l'utilisateur vers la page de paiement Stripe.