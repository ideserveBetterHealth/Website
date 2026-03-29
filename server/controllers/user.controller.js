import { User } from "../models/user.model.js";
import BHAssociate from "../models/bhAssociate.model.js";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import sendMessageViaWhatsApp from "../services/whatsappService.js";

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to get current IST timestamp
const getISTTimestamp = () => {
  const now = new Date();
  // Convert to UTC first, then add IST offset (UTC+5:30)
  const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000);
  const istTime = new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000);

  const day = String(istTime.getDate()).padStart(2, "0");
  const month = String(istTime.getMonth() + 1).padStart(2, "0");
  const year = istTime.getFullYear();
  const hours = String(istTime.getHours()).padStart(2, "0");
  const minutes = String(istTime.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year}   ${hours}:${minutes}`;
};

const normalizeIndianMobile = (value = "") => {
  let digits = value.toString().replace(/\D/g, "");

  if (digits.length > 10 && digits.startsWith("0")) {
    digits = digits.replace(/^0+/, "");
  }

  if (digits.length > 10) {
    digits = digits.slice(-10);
  }

  return digits;
};

const sanitizeAddressPayload = (payload = {}) => ({
  country: (payload.country || "India").toString().trim() || "India",
  fullName: (payload.fullName || "").toString().trim(),
  mobileNumber: normalizeIndianMobile(payload.mobileNumber || ""),
  pincode: (payload.pincode || "").toString().replace(/\D/g, "").slice(0, 6),
  flatHouseBuilding: (payload.flatHouseBuilding || "").toString().trim(),
  areaStreetSectorVillage: (payload.areaStreetSectorVillage || "")
    .toString()
    .trim(),
  landmark: (payload.landmark || "").toString().trim(),
  city: (payload.city || "").toString().trim(),
  state: (payload.state || "").toString().trim(),
  isDefault: Boolean(payload.isDefault),
});

const validateAddressPayload = (address) => {
  if (!address.fullName) return "Full name is required.";
  if (!/^[0-9]{10}$/.test(address.mobileNumber)) {
    return "Please enter a valid 10-digit mobile number.";
  }
  if (!/^[0-9]{6}$/.test(address.pincode)) {
    return "Please enter a valid 6-digit PIN code.";
  }
  if (!address.flatHouseBuilding) {
    return "Flat, House no., Building, Company, Apartment is required.";
  }
  if (!address.city) return "Town/City is required.";
  if (!address.state) return "State is required.";
  return null;
};

export const sendOTP = async (req, res) => {
  try {
    const { phoneNumber, phonePrefix = "+91" } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    // Validate phone number format
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number.",
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Find or create user
    let user = await User.findOne({ phoneNumber });

    if (user) {
      // Update existing user's OTP
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.otpVerified = false;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        phoneNumber,
        phonePrefix,
        otp,
        otpExpiry,
        otpVerified: false,
        lastActiveAt: getISTTimestamp(),
      });
    }

    // Send OTP via SMS
    const smsResult = await sendMessageViaWhatsApp(
      phonePrefix + phoneNumber,
      `🔐 *${otp} is your BetterHealth OTP*\n\n⚠ This code is valid for 10 minutes, If you did not request this, please ignore this message.\n\nThank you for choosing *BetterHealth* 🧡`,
    );

    if (!smsResult) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your WhatsApp.",
    });
  } catch (error) {
    console.log("Error in sendOTP:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send OTP. Please try again.",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required.",
      });
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please request OTP again.",
      });
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // Mark OTP as verified and clear OTP data
    user.otpVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate JWT token and send response
    return generateToken(res, user, "OTP verified successfully. Welcome!");
  } catch (error) {
    console.log("Error in verifyOTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again.",
    });
  }
};

export const completeProfile = async (req, res) => {
  try {
    const userId = req.id;
    const {
      name,
      email,
      role,
      type,
      designation,
      specialization,
      experience,
      bio,
      gender,
      dob,
      languages,
      emergencyContact,
      expertise,
      qualifications,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required to complete profile.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.otpVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your phone number first.",
      });
    }

    // Email validation if provided
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered with another account",
        });
      }
    }

    // Update user profile
    const updateData = {
      name,
      profileCompleted: true,
      "aboutUser.gender": gender,
      "aboutUser.dob": dob ? new Date(dob) : undefined,
      "aboutUser.languages": languages || [],
    };

    // Add optional fields if provided
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (type) updateData.type = type;

    // Handle emergency contact
    if (emergencyContact && emergencyContact.name) {
      const emergencyPhone =
        emergencyContact?.phoneNumber?.toString().trim() || "";

      if (
        emergencyPhone &&
        user?.phoneNumber?.toString().trim() === emergencyPhone
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Emergency contact number cannot be same as your mobile number",
        });
      }

      updateData["aboutUser.emergencyContact"] = emergencyContact;
    }

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-otp -otpExpiry");

    // Create BH Associate profile if user is a doctor
    if (role === "doctor" && type) {
      // Split comma-separated expertise into array and clean up
      const expertiseArray = expertise
        ? expertise
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
        : [];

      const bhAssociateData = {
        userId: updatedUser._id,
        specialization: specialization || type,
        bio: bio || "",
        experience: experience || "",
        expertise: expertiseArray,
        qualifications: qualifications || "",
      };

      // Add designation if provided
      if (designation) {
        bhAssociateData.designation = designation;
      }

      // Check if BH Associate profile already exists
      const existingAssociate = await BHAssociate.findOne({
        userId: updatedUser._id,
      });
      if (!existingAssociate) {
        await BHAssociate.create(bhAssociateData);
      } else {
        // Update existing profile
        await BHAssociate.findByIdAndUpdate(
          existingAssociate._id,
          bhAssociateData,
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in completeProfile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete profile. Please try again.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });

    return res.status(200).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log("Error logging out:\n", error);
    res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-otp -otpExpiry");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account is deactivated. Please contact support.",
      });
    }

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log("Error in getUserProfile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("addresses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error) {
    console.log("Error in getUserAddresses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses.",
    });
  }
};

export const addUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const address = sanitizeAddressPayload(req.body);
    const validationMessage = validateAddressPayload(address);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    const hasAnyAddress =
      Array.isArray(user.addresses) && user.addresses.length > 0;
    const shouldBeDefault = !hasAnyAddress || address.isDefault;

    if (shouldBeDefault && hasAnyAddress) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    user.addresses.push({
      ...address,
      isDefault: shouldBeDefault,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log("Error in addUserAddress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add address.",
    });
  }
};

export const updateUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const targetAddress = user.addresses.id(addressId);
    if (!targetAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    const address = sanitizeAddressPayload(req.body);
    const validationMessage = validateAddressPayload(address);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    const shouldBeDefault = address.isDefault;
    if (shouldBeDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    targetAddress.country = address.country;
    targetAddress.fullName = address.fullName;
    targetAddress.mobileNumber = address.mobileNumber;
    targetAddress.pincode = address.pincode;
    targetAddress.flatHouseBuilding = address.flatHouseBuilding;
    targetAddress.areaStreetSectorVillage = address.areaStreetSectorVillage;
    targetAddress.landmark = address.landmark;
    targetAddress.city = address.city;
    targetAddress.state = address.state;
    targetAddress.isDefault = shouldBeDefault ? true : targetAddress.isDefault;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log("Error in updateUserAddress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update address.",
    });
  }
};

export const deleteUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const targetAddress = user.addresses.id(addressId);
    if (!targetAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    const wasDefault = targetAddress.isDefault;
    targetAddress.deleteOne();

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address removed successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log("Error in deleteUserAddress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete address.",
    });
  }
};

export const setDefaultUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const targetAddress = user.addresses.id(addressId);
    if (!targetAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    user.addresses.forEach((item) => {
      item.isDefault = String(item._id) === String(addressId);
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log("Error in setDefaultUserAddress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to set default address.",
    });
  }
};

export const updateProfile = async (req, res) => {
  let photoUrl;

  try {
    const userId = req.id;
    const { name, email, emergencyContact } = req.body;
    const profilePhoto = req.file;
    if (!name && !profilePhoto && !email && !emergencyContact) {
      res.status(500).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // Email validation
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered with another account",
        });
      }
    }
    const user = await User.findById(userId);
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account is deactivated. Please contact support.",
      });
    }
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let parsedEmergencyContact = null;
    if (emergencyContact) {
      parsedEmergencyContact =
        typeof emergencyContact === "string"
          ? JSON.parse(emergencyContact)
          : emergencyContact;

      const emergencyPhone =
        parsedEmergencyContact?.phoneNumber?.toString().trim() || "";
      const emergencyRelation =
        parsedEmergencyContact?.relation?.toString().trim() || "";
      const emergencyName =
        parsedEmergencyContact?.name?.toString().trim() ||
        name?.toString().trim() ||
        user?.name ||
        "";

      if (!emergencyPhone || !/^[0-9]{10}$/.test(emergencyPhone)) {
        return res.status(400).json({
          success: false,
          message: "Emergency contact number must be exactly 10 digits",
        });
      }

      if (!emergencyRelation) {
        return res.status(400).json({
          success: false,
          message: "Emergency contact relation is required",
        });
      }

      if (user?.phoneNumber?.toString().trim() === emergencyPhone) {
        return res.status(400).json({
          success: false,
          message:
            "Emergency contact number cannot be same as your mobile number",
        });
      }

      parsedEmergencyContact = {
        name: emergencyName,
        relation: emergencyRelation,
        phoneNumber: emergencyPhone,
      };
    }

    //extract public id of the old image from the cloudinary if exist

    if (user.photoUrl) {
      const publicId = await user.photoUrl.split("/").pop().split(".")[0]; //extracting public id
      deleteMediaFromCloudinary(publicId);
    }

    //upload new photo

    if (profilePhoto) {
      const cloudResponse = await uploadMedia(profilePhoto.path);
      photoUrl = cloudResponse.secure_url;
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (profilePhoto) updatedData.photoUrl = photoUrl;
    if (parsedEmergencyContact) {
      updatedData["aboutUser.emergencyContact"] = parsedEmergencyContact;
    }

    const updateUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-otp -otpExpiry");
    return res.status(200).json({
      success: true,
      user: updateUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.log("Error in updateProfile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// Get user credits
export const getUserCredits = async (req, res) => {
  try {
    console.log("=== getUserCredits API Called ===");
    const userId = req.id;
    console.log("User ID from request:", userId);

    const user = await User.findById(userId).select("credits");
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    console.log("User credits found:", user.credits);
    return res.status(200).json({
      success: true,
      credits: user.credits || [],
    });
  } catch (error) {
    console.log("Error in getUserCredits:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user credits",
    });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const userId = req.id;

    // Get the requesting user to check if they're admin
    const requestingUser = await User.findById(userId);
    if (!requestingUser || requestingUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // Get all users with specific fields
    const users = await User.find({})
      .select(
        "name email phoneNumber role type isVerified isActive createdAt updatedAt lastActiveAt credits",
      )
      .lean();

    // Separate users by role
    const admins = users.filter((user) => user.role === "admin");
    const clients = users.filter((user) => user.role === "user");

    res.status(200).json({
      success: true,
      data: {
        admins,
        clients,
        total: users.length,
      },
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin create user directly (without OTP)
export const adminCreateUser = async (req, res) => {
  let photoUrl;

  try {
    const adminId = req.id;
    const {
      phoneNumber,
      phonePrefix = "+91",
      name,
      email,
      role = "user",
      type,
      designation,
      expertise,
      experience,
      bio,
      gender,
      dob,
      languages,
      emergencyContact,
      qualifications,
    } = req.body;
    const profilePhoto = req.file;

    // Check if requester is admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // Validate required fields
    if (!phoneNumber || !name) {
      return res.status(400).json({
        success: false,
        message: "Phone number and name are required.",
      });
    }

    // Validate phone number format
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number.",
      });
    }

    // Email validation if provided
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Check for existing users with the same phone number or email
    const existingUserQuery = email
      ? { $or: [{ phoneNumber }, { email }] }
      : { phoneNumber };

    const existingUser = await User.findOne(existingUserQuery);

    if (existingUser) {
      // Determine which field caused the conflict
      if (existingUser.phoneNumber === phoneNumber) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already registered.",
        });
      } else if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered with another account.",
        });
      }
    }

    // Validate role and type
    if (!["user", "doctor", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be user, doctor, or admin.",
      });
    }

    if (
      role === "doctor" &&
      !["psychologist", "cosmetologist"].includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid type for doctor. Must be psychologist or cosmetologist.",
      });
    }

    // Upload profile photo if provided
    if (profilePhoto) {
      const cloudResponse = await uploadMedia(profilePhoto.path);
      photoUrl = cloudResponse.secure_url;
    }

    // Create user data
    const userData = {
      phoneNumber,
      phonePrefix,
      name,
      role,
      profileCompleted: true,
      otpVerified: true, // Skip OTP verification for admin-created accounts
      isVerified: "not-verified",
    };

    // Add profile photo URL if uploaded
    if (photoUrl) {
      userData.photoUrl = photoUrl;
    }

    // Add optional fields
    if (email) userData.email = email;
    if (type) userData.type = type;
    if (gender) userData["aboutUser.gender"] = gender;
    if (dob) userData["aboutUser.dob"] = new Date(dob);
    if (languages && languages.length > 0)
      userData["aboutUser.languages"] = languages;
    if (emergencyContact && emergencyContact.name) {
      userData["aboutUser.emergencyContact"] = emergencyContact;
    }

    // Create the user
    const newUser = await User.create(userData);

    // Create BH Associate profile if user is a doctor
    if (role === "doctor" && type) {
      // Split comma-separated expertise into array and clean up
      const expertiseArray = expertise
        ? expertise
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
        : [];

      const bhAssociateData = {
        userId: newUser._id,
        designation: designation || type,
        bio: bio || "",
        expertise: expertiseArray,
        experience: experience || "",
        qualifications: qualifications || "",
      };

      if (designation) {
        bhAssociateData.designation = designation;
      }

      await BHAssociate.create(bhAssociateData);
    }

    // Return success response (exclude sensitive data)
    const userResponse = await User.findById(newUser._id)
      .select("-otp -otpExpiry")
      .lean();

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: userResponse,
    });
  } catch (error) {
    console.log("Error in adminCreateUser:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user. Please try again.",
    });
  }
};
