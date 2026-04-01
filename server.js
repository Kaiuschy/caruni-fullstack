const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect("mongodb+srv://kaiuschy_db_user:FHvjWM4oXAh6daKl@cluster0.3s4nsex.mongodb.net/caruni?appName=Cluster0")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// USER MODEL
const User = mongoose.model('User', {
    name: String,
    email: String,
    phone: String,
    address: String,
    password: String
});

// RIDE MODEL
const Ride = mongoose.model('Ride', {
    from: String,
    to: String,
    time: String,
    userId: String
});

// REGISTER
app.post('/register', async (req, res) => {
    const { name, email, phone, address, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        phone,
        address,
        password: hash
    });

    await user.save();

    res.json({ message: "User created" });
});

// LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, "secret");

    res.json({ token });
});

// GET USER
app.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "secret");

        const user = await User.findById(decoded.id).select("-password");

        res.json(user);
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
});

// CREATE RIDE
app.post('/rides', async (req, res) => {
    try {
        const { from, to, time } = req.body;

        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "secret");

        const ride = new Ride({
            from,
            to,
            time,
            userId: decoded.id
        });

        await ride.save();

        res.json({ message: "Ride created" });

    } catch {
        res.status(401).json({ error: "Error creating ride" });
    }
});

// GET RIDES
app.get('/rides', async (req, res) => {
    const rides = await Ride.find();
    res.json(rides);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));