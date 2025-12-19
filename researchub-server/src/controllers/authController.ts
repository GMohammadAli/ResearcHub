import { Request, Response } from "express";
import { UserModel } from "../models/User";
import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const saltRounds = process.env.BCRYPT_SALT_ROUNDS || 10;

const sha256 = (value: string): string => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

const getUser = async ({
  username,
  email = null,
}: {
  username: string;
  email: string | null;
}) => {
  try {
    const user = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    return user;
  } catch (error) {
    console.error("Error while fetching user from db: ", error);
  }
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email, personalDetails = null } = req.body;

    const checkIfUserExists = await getUser({ username, email });
    if (checkIfUserExists) {
      return res
        .status(400)
        .json({ message: "Username or Email Already Exists!" });
    }

    const salt = await bcrypt.genSalt(Number(saltRounds));
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      email,
      personalDetails,
    });
    console.log("New User Created", newUser.username);
    return res.status(201).json({
      message: "User Created Successfully!",
      data: { username: newUser.username },
    });
  } catch (error) {
    console.error("Error during registartion ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await getUser({ username, email });
    if (!user) {
      return res.status(400).json({
        messages: "Incorrect password or username",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Incorrect password or username",
      });
    }

    req.session.user = { userId: sha256(user._id?.toString()) };

    return res.status(200).json({
      message: "Log In successful",
      data: {
        username: user.username,
        email: user.email,
        personalDetails: user.personalDetails,
      },
    });
  } catch (error) {
    console.error("Error while log in", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error while destroying the session: ", err);
      return res.status(500).json({
        message: "Error logging out",
      });
    }
    res.clearCookie("connect.sid");
    console.log("User logged out successfully");
    return res.status(200).json({
      message: "Log out successful",
    });
  });
};

export default {
  registerUser,
  loginUser,
  logoutUser,
};
