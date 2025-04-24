import { LLMEvaluator } from "./llmClient";
import { Candidate, MatchResult } from "./types";

export class CandidateService {
  private llmClient: LLMEvaluator;

  constructor(llmApiKey: string, llmEndpoint: string) {
    this.llmClient = new LLMEvaluator(llmApiKey, llmEndpoint);
  }

  async evaluateCandidate(candidate: Candidate): Promise<MatchResult> {
    const evaluation = {
      candidateId: candidate.cstName,
      score: await this.llmClient.evaluateCandidate(candidate),
      rationale: await this.llmClient.generateRationale(candidate),
    };

    return evaluation;
  }
}
