export interface Candidate {
  cstName: string;
  clientProblemStatement: string;
  title: string;
  location: string;
  industry: string;
  requiredSkills: string;
  yearsExperience: number;
}

export interface MatchResult {
  candidateId: string;
  score: number;
  rationale: string;
}

export interface MatchResponse {
  matches: MatchResult[];
}
