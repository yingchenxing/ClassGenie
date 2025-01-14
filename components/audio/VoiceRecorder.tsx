'use client'

import { useEffect, useState } from 'react'
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from '@/app/context/DeepgramContextProvider'
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from '@/app/context/MicrophoneContextProvider'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Sparkles } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { generateSummary } from '@/apis/analyzeService'
import { useOpenAIKey } from '@/app/context/OpenAIContextProvider'
import { useProjectEnv } from '@/app/context/ProjectEnvContextProvider'

const VoiceRecorder: () => JSX.Element = () => {
  const [transcriptions, setTranscriptions] = useState<
    { text: string; timestamp: string }[]
  >([])

  const { openaiKey } = useOpenAIKey()
  const { setSummary } = useProjectEnv()
  const { connection, connectToDeepgram, connectionState } = useDeepgram()
  const {
    setupMicrophone,
    microphone,
    startMicrophone,
    stopMicrophone,
    microphoneState,
  } = useMicrophone()

  useEffect(() => {
    setupMicrophone()
  }, [])

  // useEffect(() => {
  //   if (microphoneState === MicrophoneState.Ready) {
  //     connectToDeepgram({
  //       model: 'nova-2',
  //       interim_results: true,
  //       smart_format: true,
  //       filler_words: true,
  //       utterance_end_ms: 3000,
  //     })
  //   }
  // }, [microphoneState, connectToDeepgram])

  useEffect(() => {
    if (!microphone || !connection) return

    const onData = (e: BlobEvent) => {
      if (e.data.size > 0) {
        console.log('Sending data to Deepgram')
        connection?.send(e.data)
      }
    }

    const onTranscript = (data: LiveTranscriptionEvent) => {
      console.log('Received transcript:', data)
      const { is_final: isFinal } = data
      const transcript = data.channel.alternatives[0].transcript

      if (transcript !== '') {
        if (isFinal) {
          const timestamp = new Date().toLocaleTimeString()
          setTranscriptions((prev) => [
            ...prev,
            { text: transcript, timestamp },
          ])
        }
      }
    }

    if (connectionState === LiveConnectionState.OPEN) {
      console.log('Adding event listeners')
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript)
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData)
    }

    return () => {
      console.log('Removing event listeners')
      if (connection) {
        connection.removeListener(
          LiveTranscriptionEvents.Transcript,
          onTranscript
        )
      }
      if (microphone) {
        microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData)
      }
    }
  }, [connection, microphone, connectionState])

  useEffect(() => {
    if (!connection) return

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive()
    }
  }, [microphoneState, connectionState])

  const toggleMicrophone = () => {
    if (microphoneState === MicrophoneState.Open) {
      stopMicrophone()
    } else {
      startMicrophone()
      connectToDeepgram({
        model: 'nova-2',
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      })
    }
  }

  const handleSummarize = async () => {
    console.log('Summarizing transcriptions:', transcriptions)
    const summary = await generateSummary(transcriptions, openaiKey)
    setSummary(summary)
    console.log('Summary:', summary)
  }

  return (
    <>
      <div className="flex flex-col h-full rounded-lg border">
        <div className="flex-1 overflow-hidden p-4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <ul>
              {transcriptions.map((transcription, index) => (
                <li key={index} className="bg-gray-100 p-2 my-1 rounded">
                  <span className="text-xs text-gray-500 block">
                    {transcription.timestamp}
                  </span>
                  <span>{transcription.text}</span>
                </li>
              ))}
            </ul>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
        <div className="flex justify-center gap-2 p-4">
          <Button onClick={toggleMicrophone} className="flex items-center">
            {microphoneState === MicrophoneState.Open ? (
              <>
                <MicOff className="mr-2" /> Stop
              </>
            ) : (
              <>
                <Mic className="mr-2" /> Start
              </>
            )}
          </Button>
          <Button
            onClick={handleSummarize}
            className="flex items-center"
            disabled={transcriptions.length === 0}>
            <Sparkles className="mr-2" /> Summarize
          </Button>
        </div>
      </div>
    </>
  )
}

export default VoiceRecorder
