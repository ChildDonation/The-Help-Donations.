
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
app.use(express.static('public'));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Donation to THE HELP',
                },
                unit_amount: 1000,
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://yourdomain.com/success',
        cancel_url: 'https://yourdomain.com/cancel',
    });
    res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Server is running on http://localhost:4242'));
