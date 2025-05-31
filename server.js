const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle Stripe checkout
app.post('/create-checkout-session', async (req, res) => {
  const amount = parseInt(req.body.amount, 10); // ex: 500 = $5.00

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Donation',
        },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    // KORIJAN: mete backticks pou template literal la mache!
    success_url: `${req.protocol}://${req.get('host')}/success.html`,
    cancel_url: `${req.protocol}://${req.get('host')}/cancel.html`,
  });

  res.redirect(303, session.url);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // KORIJAN: mete backticks pou template literal la mache!
  console.log(`✅ Server is running on port ${PORT}`);
});
