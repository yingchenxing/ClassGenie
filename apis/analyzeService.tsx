import { useOpenAIKey } from '@/app/context/OpenAIContextProvider'
import { useProjectEnv } from '@/app/context/ProjectEnvContextProvider'

interface Transcription {
  text: string
  timestamp: string
}

export async function generateSummary(
  transcriptions: Transcription[],
  openaiKey: string
): Promise<string> {
  if (!openaiKey) {
    throw new Error('OpenAI API key is not set')
  }

  const transcriptText = transcriptions.map((t) => t.text).join('\n')

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert summarizer. Your task is to generate a concise and structured summary of a transcription in Markdown format. Follow this structure strictly:\n\n' +
              'Overview: Provide a high-level summary of the content in 2-3 sentences. Mention the main topic and the purpose of the conversation.\n' +
              'Key Points: List the critical points discussed in bullet format. Focus on essential details, avoiding redundant information.\n' +
              'Important Quotes or Statements: Highlight 2-3 notable quotes or statements that capture the essence of the conversation. Use quotation marks.\n' +
              'Action Items or Next Steps: If applicable, provide any actions, recommendations, or follow-ups mentioned in the transcription.\n' +
              'Conclusion: End with a brief summary sentence that wraps up the main discussion or takeaway.\n' +
              'Make sure the Markdown is properly formatted with headers, bullet points, and indentation for readability. Ensure all content is professional and concise.',
          },
          {
            role: 'user',
            content: `Please summarize the following transcribed text:\n\n${transcriptText}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate summary')
    }

    const data = await response.json()
    const summary = data.choices[0].message.content

    return summary
  } catch (error) {
    console.error('Error generating summary:', error)
    throw error
  }
}
