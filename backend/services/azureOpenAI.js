import axios from 'axios';

/**
 * Azure OpenAI Service for Skill Verification
 * Sends structured prompts and returns deterministic JSON responses
 */
class AzureOpenAIService {
  constructor() {
    this.endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    this.apiKey = process.env.AZURE_OPENAI_API_KEY;
    this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';
    this.apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';
  }

  /**
   * Evaluate a student submission and return structured skill verification
   * @param {Object} params - Evaluation parameters
   * @returns {Promise<Object>} Structured evaluation result
   */
  async evaluateSubmission({
    taskTitle,
    taskDescription,
    requiredSkills,
    difficulty,
    evaluationCriteria,
    submissionType,
    githubMetadata,
    fileMetadata,
    submissionContent,
  }) {
    const prompt = this.buildEvaluationPrompt({
      taskTitle,
      taskDescription,
      requiredSkills,
      difficulty,
      evaluationCriteria,
      submissionType,
      githubMetadata,
      fileMetadata,
      submissionContent,
    });

    try {
      const response = await axios.post(
        `${this.endpoint}openai/deployments/${this.deploymentName}/chat/completions?api-version=${this.apiVersion}`,
        {
          messages: [
            {
              role: 'system',
              content: `You are an expert technical evaluator for student submissions. You must return ONLY valid JSON in the exact format specified. Do not include any markdown formatting, code blocks, or additional text.`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3, // Lower temperature for more deterministic results
          max_tokens: 2000,
          response_format: { type: 'json_object' }, // Force JSON response
        },
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      const parsedResult = this.parseAIResponse(aiResponse);

      // Validate the response structure
      this.validateEvaluationResult(parsedResult);

      return {
        result: parsedResult,
        rawResponse: aiResponse,
        prompt: prompt,
      };
    } catch (error) {
      console.error('Azure OpenAI API Error:', error.response?.data || error.message);
      throw new Error(`AI evaluation failed: ${error.message}`);
    }
  }

  /**
   * Build the evaluation prompt with all necessary context
   */
  buildEvaluationPrompt({
    taskTitle,
    taskDescription,
    requiredSkills,
    difficulty,
    evaluationCriteria,
    submissionType,
    githubMetadata,
    fileMetadata,
    submissionContent,
  }) {
    let submissionContext = '';

    if (submissionType === 'github') {
      submissionContext = `
GitHub Repository Information:
- Repository: ${githubMetadata?.owner}/${githubMetadata?.repo}
- Branch: ${githubMetadata?.branch || 'main'}
- Language: ${githubMetadata?.metadata?.language || 'Unknown'}
- Description: ${githubMetadata?.metadata?.description || 'N/A'}
- README: ${githubMetadata?.metadata?.readme?.substring(0, 2000) || 'N/A'}
`;
    } else if (submissionType === 'file') {
      submissionContext = `
File Submission:
- Filename: ${fileMetadata?.originalName || 'N/A'}
- Type: ${fileMetadata?.mimeType || 'N/A'}
- Size: ${fileMetadata?.size || 0} bytes
- Content Preview: ${submissionContent?.substring(0, 2000) || 'N/A'}
`;
    }

    return `Evaluate this student submission for a micro-internship task.

TASK DETAILS:
Title: ${taskTitle}
Description: ${taskDescription}
Required Skills: ${requiredSkills.join(', ')}
Difficulty Level: ${difficulty}
Evaluation Criteria: ${evaluationCriteria}

${submissionContext}

INSTRUCTIONS:
1. Evaluate the submission against the required skills and criteria
2. Assign scores (0-100) for each required skill
3. Calculate an overall score (0-100) based on all factors
4. Identify specific strengths and weaknesses
5. Generate a professional resume bullet point
6. Assess plagiarism risk based on code patterns and originality

RETURN ONLY VALID JSON IN THIS EXACT FORMAT (no markdown, no code blocks):
{
  "overallScore": <number 0-100>,
  "skillBreakdown": {
    "<skill1>": <number 0-100>,
    "<skill2>": <number 0-100>
  },
  "strengths": ["<strength1>", "<strength2>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "resumeBullet": "<professional bullet point>",
  "plagiarismRisk": "low" | "medium" | "high"
}`;
  }

  /**
   * Parse and clean AI response
   */
  parseAIResponse(response) {
    try {
      // Remove markdown code blocks if present
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/```\n?/g, '');
      }

      return JSON.parse(cleaned);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid JSON response from AI');
    }
  }

  /**
   * Validate the evaluation result structure
   */
  validateEvaluationResult(result) {
    const requiredFields = [
      'overallScore',
      'skillBreakdown',
      'strengths',
      'weaknesses',
      'resumeBullet',
      'plagiarismRisk',
    ];

    for (const field of requiredFields) {
      if (!(field in result)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (
      typeof result.overallScore !== 'number' ||
      result.overallScore < 0 ||
      result.overallScore > 100
    ) {
      throw new Error('overallScore must be a number between 0 and 100');
    }

    if (typeof result.skillBreakdown !== 'object') {
      throw new Error('skillBreakdown must be an object');
    }

    if (!Array.isArray(result.strengths) || !Array.isArray(result.weaknesses)) {
      throw new Error('strengths and weaknesses must be arrays');
    }

    if (!['low', 'medium', 'high'].includes(result.plagiarismRisk)) {
      throw new Error('plagiarismRisk must be "low", "medium", or "high"');
    }
  }
}

export default new AzureOpenAIService();

