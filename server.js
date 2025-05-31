app.post('/create-checkout-session', async (req, res) => {
  const amount = parseInt(req.body.amount, 10); // sa li soti nan form lan

  try {
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
  } catch (err) {
    console.error('Stripe session error:', err.message);
    res.status(500).send('Error creating Stripe checkout session');
  }
});
