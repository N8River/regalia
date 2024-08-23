const User = require("../model/user");
const mongoose = require("mongoose");

exports.addAddress = async (req, res, next) => {
  try {
    const addressData = req.body;
    console.log("🔴 Address Data:", addressData);

    const userId = req.user.userId;
    console.log("🔴 User ID:", userId);

    const user = await User.findById(userId);
    console.log("🔴 User:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.address.length === 0) {
      addressData.isDefault = true; // Set the first address as default
    } else {
      addressData.isDefault = false; // Other addresses are not default
    }

    user.address.push(addressData);

    await user.save();

    res.status(200).json({ message: "Address added successfully" });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ message: "Failed to create address" });
  }
};

exports.setDefaultAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    console.log("🔴 User Id:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const addressId = req.params.addressId;
    console.log("🔴 Address Id:", addressId);

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid address ID." });
    }

    const user = await User.findById(userId);
    console.log("🔴 User:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.address.forEach((address) => {
      address.isDefault = address._id.toString() === addressId;
    });

    await user.save();

    res.status(200).json({
      message: "Default address set successfully",
      addresses: user.address,
    });
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Failed to fetch address" });
  }
};

exports.editAddress = async (req, res, next) => {
  try {
    const addressData = req.body;
    // console.log("🔴 Address Data:", addressData);

    const userId = req.user.userId;
    // console.log("🔴 User ID:", userId);

    const user = await User.findById(userId);
    console.log("🔴 User:", user);

    const addressId = req.params.addressId;

    // console.log(
    //   "🔴 :",
    //   user.address.find(
    //     (address) => address._id.toString() === "66ab37b881ca7cc400b50eeb"
    //   )
    // );

    const addressToUpdate = user.address.find(
      (address) => address._id.toString() === addressId.toString()
    );

    if (!addressToUpdate) {
      return res.status(404).json({ message: "Address not found" });
    }

    console.log("🔴 Address to update:", addressToUpdate);

    addressToUpdate.line1 = addressData.line1 || addressToUpdate.line1;
    addressToUpdate.line2 = addressData.line2 || addressToUpdate.line2;
    addressToUpdate.city = addressData.city || addressToUpdate.city;
    addressToUpdate.state = addressData.state || addressToUpdate.state;
    addressToUpdate.zip = addressData.zip || addressToUpdate.zip;
    addressToUpdate.country = addressData.country || addressToUpdate.country;

    await user.save();

    res.status(200).json({ message: "Address edited successfully" });
  } catch (error) {
    console.error("Error editing address:", error);
    res.status(500).json({ message: "Failed to edit address" });
  }
};

exports.getAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    const addressArr = user.address;
    // console.log("🔴 Address Array:", addressArr);

    res.json(addressArr);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Failed to fetch address" });
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const addressId = req.params.addressId;

    // Find the user by ID and update their address array by pulling the address with the given ID
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { address: { _id: addressId } } },
      { new: true } // Return the updated document
    );

    // Check if the address was successfully removed
    const addressToRemove = user.address.id(addressId);
    if (addressToRemove) {
      return res.status(500).json({ message: "Failed to delete address" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
};
