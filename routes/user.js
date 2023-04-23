const router = require('express').Router();

const Users = require('../models/Users');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');


// UPDATE
router.put('/:id', verifyToken, verifyTokenAndAuthorization, async (req, res) => {
    const password = req.user.password;
    console.log(password)
    const pass = JSON.stringify(password)
    if (password) {
        password = CryptoJS.AES.encrypt(pass, process.env.PASS_SEC).toString();
    }
    try {
        const updateduser = await Users.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateduser)
    } catch (error) {
        return res.status(500).json(error);
    }
})

// DELETE

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Users.findByIdAndDelete(req.params.id);
        res.status(200).json('user has been deleted....')
    } catch (error) {
        res.status(500).json(error);
    }
})


//GET USER
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        const { password, ...others } = user._doc
        res.status(200).json({ ...others });
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET ALL USER
router.get('/data', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await Users.find().sort({ _id: -1 }).limit(1) : await Users.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET USER STATS
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const datas = await Users.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            { $project: { month: { $month: "$createdAt" } } },
            { $group: { _id: "$month", total: { $sum: 1 } } },
        ]);
        res.status(200).json(datas)
    } catch (error) {
        res.status(500).json(err);

    }
})



module.exports = router;