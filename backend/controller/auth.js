const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  // User registration
  try {
    // Check if signups are disabled
    if (process.env.SIGNUP_DISABLED === "true") {
      return res
        .status(403)
        .json({ message: "Signups are currently disabled" });
    }

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
  try {
    let loadedUser;
    const { email, password } = req.body;

    // Restrict logins to allowed accounts
    const allowedEmails = process.env.RESTRICTED_LOGINS
      ? process.env.RESTRICTED_LOGINS.split(",")
      : [];

    if (!allowedEmails.includes(email)) {
      return res
        .status(403)
        .json({ message: "Login restricted for this account" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    loadedUser = user;

    // Check if password is correct
    const passwordCorrect = await loadedUser.comparePasswords(password);

    if (!passwordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // JWT Token generation
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
        isAdmin: loadedUser.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.json({ token });
  } catch (error) {
    console.log("Error logging user in:", error);
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
      {
        email: admin.email,
        userId: admin._id.toString(),
        isAdmin: admin.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
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

    const { isAdmin, ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    console.log("Error getting user info:", error);
    res.status(500).send("Failed to get user info");
  }
};

exports.checkIsAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.isAdmin) {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(403).json({ isAdmin: false });
    }
  } catch (error) {
    return res.status(400).send("Invalid token");
  }
};
