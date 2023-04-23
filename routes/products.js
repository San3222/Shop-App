const router = require('express').Router();

const Product = require('../models/Product');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

// CREATES PRODUCT
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const saveProduct = await newProduct.save()
        res.status(201).json(saveProduct);
    } catch (error) {
        res.status(500).json(error)
    }
});

// UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedProduct)
    } catch (error) {
        return res.status(500).json(error);
    }
})

// DELETE

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json('Product has been deleted....')
    } catch (error) {
        res.status(500).json(error);
    }
})


//GET PRODUCT
router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET ALL PRODUCT
router.get('/all', async (req, res) => {
    const qNew = req.query.new;
    const qCategary = req.query.categary;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategary) {
            products = await Product.find({
                categories: {
                    $in: [qCategary]
                }
            });
        } else {
            products = await Product.find();
        }
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET PRODUCT STATS
router.get('/stats',  async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const datasProduct = await Product.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            { $project: { month: { $month: "$createdAt" } } },
            { $group: { _id: "$month", total: { $sum: 1 } } },
        ]);
        res.status(200).json(datasProduct)
    } catch (error) {
        res.status(500).json(err);

    }
})



module.exports = router;