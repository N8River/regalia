const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  // User registration
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash password
    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPw,
      isAdmin: false, // Ensure normal users are not admins
    });

    const savedUser = await user.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

exports.login = async (req, res, next) => {
  // User login
  try {
    let loadedUser;
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("Invalid email");
    }

    loadedUser = user;

    // Check if password is correct
    const passwordCorrect = await loadedUser.comparePasswords(password);

    if (!passwordCorrect) {
      return res.status(401).send("Invalid password");
    }

    // JWT Token generation
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
        isAdmin: loadedUser.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    // Token sent as response
    res.json({ token });
  } catch (error) {
    console.log("Error loggin user in:", error);
    res.status(500).json({ message: "Failed to login as user" });
  }
};

exports.adminLogin = async (req, res, next) => {
  // Admin Login
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email: email, isAdmin: true });

    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.log("Error loggin admin in:", error);
    res.status(500).json({ message: "Failed to login as ADMIN" });
  }
};

exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Ignores the password

    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.log("Error getting user info:", error);
    res.status(500).send("Failed to get user info");
  }
};
