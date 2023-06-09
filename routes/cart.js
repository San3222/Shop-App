const router = require('express').Router();

const Cart = require('../models/Cart');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

// CREATES PRODUCT
router.post('/',verifyToken , async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const saveCart = await newCart.save()
        res.status(201).json(saveCart);
    } catch (error) {
        res.status(500).json(error)
    }
});

// UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedCart)
    } catch (error) {
        return res.status(500).json(error);
    }
})

// // DELETE

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('Cart has been deleted....')
    } catch (error) {
        res.status(500).json(error);
    }
})


//GET USER CART
router.get('/find/:userId',verifyTokenAndAuthorization, async (req, res) => {
    try {
        const getCart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json({ getCart });
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET ALL USER CART
router.get('/all', verifyTokenAndAdmin,async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(500).json(carts)
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router;