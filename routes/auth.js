
const router = require('express').Router();
const User = require('../models/Users');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// register 

router.post('/register', async (req, res) => {

    const { username, email, password } = req.body;
    // const data = JSON.stringify(password)
    const cryptpassword = cryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();

    const newUser = new User({
        username: username,
        email: email,
        password: cryptpassword
    })
    try {
        const saveUser = await newUser.save();
        res.status(201).json(saveUser)

    } catch (error) {
        res.status(500).json(error)
    }
})


//LOGIN

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // const pass = JSON.stringify(password);
        const user = await User.findOne({ username: username });

        if (user) {
            const hashpassword = cryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
            const decryptPassword = hashpassword.toString(cryptoJS.enc.Utf8);

            if (password === decryptPassword) {

                const accessToken = jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SEC,{expiresIn:'3d'});
                const {password, ...others} = user._doc
                res.status(200).json({...others,accessToken});
            } else {
                res.status(401).json({ message: "wrong credential pass " });
            }
        } else {
            res.status(401).json({ message: "wrong credential user " });
        }
    } catch (error) {
        res.status(500).json(error)
    }

})


module.exports = router;