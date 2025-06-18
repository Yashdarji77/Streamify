import { generateStreamToken } from "../db/stream.js";

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id);

    return res.status(200).json({
      success: true,
      token: token,
    });

  } catch (error) {
    console.error("Error generating Stream token:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
