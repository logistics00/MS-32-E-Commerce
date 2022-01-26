const stripe = require('stripe')(
  'sk_test_51IGGGpJt2sPpERjGG43BYSTG0r6j69qwxchskCAihkUy2zcSR00tnrIu4izpBMROr2ZWNzKAU7jo4PO3aRdj4fJE009FfzwF60'
);

const Order = require('../models/order-model');
const User = require('../models/user-model');

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: [
      'card',
    ]
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Dummy'
          },
          unit_amount_decimal: 10.99
        }
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `localhost:3000/success`,
    cancel_url: `localhost:3000/cancel`,
  });

  res.redirect(303, session.url);
}

function getSuccess(req, res) {
  res.render('customer/orders/success')
}

function getFailure(req, res) {
  res.render('customer/orders/failure')
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getFailure: getFailure,
};
