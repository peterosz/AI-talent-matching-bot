import express, { Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import { CandidateService } from "./candidateService";

const app = express();
dotenv.config();
app.use(express.json());

app.use(helmet());

const candidateService = new CandidateService(
  process.env.LLM_API_KEY!,
  process.env.LLM_ENDPOINT!
);

app.post("/evaluate", async (req: Request, res: Response): Promise<any> => {
  console.log("Received request:", req.body);
  try {
    if (!req.body) {
      return res.status(400).json({
        error: "Missing required parameters: candidates and/or cstInput",
      });
    }

    const evaluation = await candidateService.evaluateCandidate(req.body);

    res.json(evaluation);
  } catch (error) {
    console.error("Error processing match request:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
