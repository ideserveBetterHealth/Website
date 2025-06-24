import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const { password, ...userWithoutPassword } = user.toObject();

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      success: "true",
      message: `Welcome Back ${user.name}`,
      user: userWithoutPassword,
    });
};
