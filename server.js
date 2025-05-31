app.post('/create-checkout-session', async (req, res) => {
  const amount = parseInt(req.body.amount); // ex: 500 = $5.00

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
    success_url: `${req.protocol}://${req.get('host')}/success.html`,
    cancel_url: `${req.protocol}://${req.get('host')}/cancel.html`,
  });

  res.redirect(303, session.url);
});
