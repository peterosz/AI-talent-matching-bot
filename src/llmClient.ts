import axios from "axios";
import { Candidate } from "./types";

export class LLMEvaluator {
  private readonly apiKey: string;
  private readonly endpoint: string;

  constructor(apiKey: string, endpoint: string) {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
  }
  async evaluateCandidate(candidate: Candidate): Promise<number> {
    console.log("Evaluating candidate:", candidate);
    const prompt = `
            Evaluate this candidate's fit for the specified role:
            Candidate Profile:
            ${JSON.stringify(candidate, null, 2)}
            
            Return a score between 0 and 100 indicating match quality.
        `;

    const response = await axios
      .post(
        this.endpoint,
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      )
      .catch((err) => {
        console.log("Status:", err.response?.status);
        console.log("Headers:", err.response?.headers);
        console.log("Data:", err.response?.data);
      });

    console.log("LLM response:", response);

    return 1;
  }

  async generateRationale(candidate: Candidate): Promise<string> {
    console.log("Generating rationale for candidate:", candidate);
    const prompt = `
            Generate a detailed rationale explaining why this candidate is a strong fit for the role.
            Consider their skills, experience, and background against the role requirements.
          
            ${candidate}
            
            Return a professional, structured evaluation focusing on strengths and alignment with requirements.
        `;

    const response = await axios.post(
      this.endpoint,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error("Invalid response from LLM: No choices returned.");
    }

    return response.data.choices[0].text;
  }
}
