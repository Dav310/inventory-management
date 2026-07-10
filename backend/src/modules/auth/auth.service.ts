import bcrypt from "bcrypt";
import { database } from "../../utils/database.ts";
import type { LoginDto } from "./auth.types.ts";
import { generateToken } from "../../utils/jwt.ts";

export const authenticateUser = async (loginData: LoginDto) => {
  const { username, password } = loginData;

  const result = await database.query(
    "SELECT * FROM users WHERE username = $1",
    [username],
  );
  if (result.rows.length === 0) {
    throw new Error("Invalid Username or Passoword");
  }
  const user = result.rows[0];
  console.log("authenticateUser", user);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid Username or Password");
  }

  const token = generateToken({
    userId: user.id,
    username: user.username,
  });

  delete user.password;

  return {
    user,
    token,
  };
};
