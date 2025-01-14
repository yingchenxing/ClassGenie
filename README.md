# AI Voice Recorder & Summarizer

Are you tired of taking notes during lengthy lectures or endless meetings? This Next.js application provides real-time voice transcription and AI-powered summarization, helping you focus on the conversation while automatically capturing and organizing the key points. Try it out at [record.11chen.link](https://record.11chen.link/)

![image](https://github.com/user-attachments/assets/f9674a64-6e3b-4e22-b207-6ac4b1a61517)


## Features

- 🎙️ Real-time voice recording and transcription
- 🤖 AI-powered summarization of conversations
- 📝 Markdown editor for summary viewing and editing

## Disclaimer

⚠️ **Recording Notice**: This application records audio through your device's microphone. Please ensure you have obtained appropriate consent from all parties before recording any conversations. Users are responsible for complying with all applicable laws and regulations regarding audio recording in their jurisdiction.

**Liability Disclaimer**: The developers of this application assume no responsibility or liability for any misuse of the recording functionality or any consequences arising from the use of this application. Users are solely responsible for how they use this tool and must ensure their use complies with all applicable laws, regulations, and ethical guidelines.

## Prerequisites

- Node.js 18+
- OpenAI API key
- Deepgram API key

## Getting Started

1. Clone the repository:

```bash
npm run dev
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

Before using the application, you'll need to set up your API keys:

1. Get your API keys:

   - [OpenAI API Key](https://platform.openai.com/api-keys)
   - [Deepgram API Key](https://console.deepgram.com/project)

2. Click the settings icon in the top right corner of the application
3. Enter your API keys in the settings dialog
4. Click Save

## How to Use

1. **Start Recording**

   - Click the "Start" button with the microphone icon
   - Allow microphone access when prompted
   - Speak clearly into your microphone

2. **View Transcriptions**

   - Real-time transcriptions will appear in the left panel

3. **Generate Summary**
   - Click the "Summarize" button with the sparkles icon
   - The AI will generate a structured summary in markdown format
   - View and edit the summary in the right panel

## License

MIT License - feel free to use this project for your own purposes.
