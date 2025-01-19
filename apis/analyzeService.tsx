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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a meticulous note-taker. Transform the transcription into detailed, well-organized notes that:\n\n' +
              '- Preserve all important details, technical terms, and specific information\n' +
              '- Maintain the original flow and logic of the discussion\n' +
              '- Keep original phrasing where it adds value\n' +
              '- Use clear formatting with headers and nested points as needed\n' +
              '- Organize related points together naturally\n' +
              '- Include all mentioned tasks, decisions, and commitments\n\n' +
              'Format in Markdown, but organize the content based on the natural flow of information rather than following a rigid structure.',
          },
          {
            role: 'user',
            content: `Please summarize the following transcribed text:\n\n${transcriptText}`,
          },
        ],
        temperature: 0.7,
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
