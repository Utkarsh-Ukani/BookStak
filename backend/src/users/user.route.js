import express from "express";
import User from "./user.model.js";
import jwt from "jsonwebtoken";

const router = express.Router();


router.post("/admin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await User.findOne({ username });

    if (!admin) {
      res.status(401).send({ message: "Admin not found" });
    }

    if (admin.password !== password) {
      res.status(401).send({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );


    return res.status(200).json({
      message: "Authentication Successfull",
      token,
      user: {
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Failed to login as admin",error);
    res.status(401).send({ message: "Failed to login as admin" });
  }
});

export default router;
