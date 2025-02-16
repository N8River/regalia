const Cart = require("../model/cart");
const CartItem = require("../model/cartItem");
const Product = require("../model/product");
const User = require("../model/user");

const calculateCartTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.items.forEach((item) => {
    totalPrice += item.productId.price * item.quantity;
  });
  return totalPrice;
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    // Find the cart for the user
    let cart = await Cart.findOne({ userId }).populate("items");

    // If no cart exists, create a new one
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Find if the product already exists in the cart
    let cartItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (cartItem) {
      // If the product is already in the cart, increase the quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Otherwise, create a new CartItem and add it to the cart
      cartItem = new CartItem({ productId, quantity });
      await cartItem.save();
      cart.items.push(cartItem._id);
    }

    // Update the total price in the cart
    const product = await Product.findById(productId);

    await cart.populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });

    cart.totalPrice = calculateCartTotalPrice(cart);

    // Save the cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.log("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.log("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch the cart" });
  }
};

exports.updateCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.items.find(
      (i) => i.productId._id.toString() === productId.toString()
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const product = await Product.findById(productId);

    // Calculate the total price
    let cartItemPrice = 0;
    cart.items.forEach((i) => {
      cartItemPrice += i.productId.price * i.quantity;
    });

    await cart.populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });

    cart.totalPrice = calculateCartTotalPrice(cart);

    cart.markModified("items");

    await CartItem.findByIdAndUpdate(cartItem._id, { quantity });

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.log("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { productId } = req.params;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItemToDelete = cart.items.find(
      (i) => i.productId._id.toString() === productId.toString()
    );

    if (!cartItemToDelete) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    // Remove the cart item from the CartItem collection
    await CartItem.findByIdAndDelete(cartItemToDelete._id);

    await cart.populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });

    cart.totalPrice = calculateCartTotalPrice(cart);

    await cart.save();

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.log("Failed to delete item from the cart", error);
  }
};

exports.getCartItemCount = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    const cart = await Cart.findOne({ userId }).populate("items");

    if (!cart) {
      return res.status(200).json({ itemCount: 0 }); // Instead of 404, return 0
    }

    const totalItemCount = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    res.status(200).json({ itemCount: totalItemCount });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart item count" });
  }
};
