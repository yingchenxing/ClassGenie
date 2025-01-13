import { useOpenAIKey } from '@/app/context/OpenAIContextProvider'
import { useProjectEnv } from '@/app/context/ProjectEnvContextProvider'

interface Transcription {
  text: string
  timestamp: string
}

export async function generateSummary(
  transcriptions: Transcription[]
): Promise<string> {
  const { openaiKey } = useOpenAIKey()
  const { setSummary } = useProjectEnv()

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
              'You are a helpful assistant that summarizes transcribed text. Create a clear, concise summary that captures the main points and key details.',
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

    // Update the global summary state
    setSummary(summary)

    return summary
  } catch (error) {
    console.error('Error generating summary:', error)
    throw error
  }
}
