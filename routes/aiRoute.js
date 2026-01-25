import express from "express";
import { getAiResponse } from "../controller/aiController.js";

const aiRouter = express.Router();
aiRouter.post("/chat", getAiResponse);

export default aiRouter;