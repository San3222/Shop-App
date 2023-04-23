const router = require('express').Router();

const Order = require('../models/Order');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

// CREATES PRODUCT
router.post('/', verifyToken, async (req, res) => {
    const newOrders = new Order(req.body);
    try {
        const saveOrder = await newOrders.save()
        res.status(201).json(saveOrder);
    } catch (error) {
        res.status(500).json(error)
    }
});

// UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedOrder)
    } catch (error) {
        return res.status(500).json(error);
    }
})

// // DELETE

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Order has been deleted....')
    } catch (error) {
        res.status(500).json(error);
    }
})


//GET USER ORDERS
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const getOrders = await Order.find({ userId: req.params.userId });
        res.status(200).json({ getOrders });
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET ALL USER ORDERS
router.get('/all', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(500).json(orders)
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET MONTHLY INCOME
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    console.log(previousMonth);
    try {
        const incomes = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ]);
        console.log(incomes)
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json(error)
    }

});


module.exports = router;