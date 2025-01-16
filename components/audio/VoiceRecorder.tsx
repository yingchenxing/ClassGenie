'use client'

import { useEffect, useState, useRef } from 'react'
import {
  SOCKET_STATES,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from '@/app/context/DeepgramContextProvider'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Sparkles, Download, Trash2 } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { generateSummary } from '@/apis/analyzeService'
import { useOpenAIKey } from '@/app/context/OpenAIContextProvider'
import { useProjectEnv } from '@/app/context/ProjectEnvContextProvider'
import { SettingsDialog } from '@/components/nav/settings-dialog'

const VoiceRecorder: () => JSX.Element = () => {
  const [transcriptions, setTranscriptions] = useState<
    { text: string; timestamp: string }[]
  >([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { openaiKey } = useOpenAIKey()
  const { deepgramKey } = useDeepgram()
  const { setSummary } = useProjectEnv()
  const { connection, connectToDeepgram, connectionState, disconnectFromDeepgram } = useDeepgram()

  const keepAliveInterval = useRef<any>();


  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const setupMicrophone = async () => {
    const userMedia = await navigator.mediaDevices.getUserMedia({
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
      }
    })
    setMediaStream(userMedia);
    const microphone = new MediaRecorder(userMedia)
    setMicrophone(microphone)
  }



  useEffect(() => {
    if (!microphone || !connection) return

    const onData = (e: BlobEvent) => {
      if (e.data.size > 0 && connectionState === SOCKET_STATES.open) {
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

    if (connectionState === SOCKET_STATES.open) {
      console.log('Adding event listeners')
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript)
      microphone.addEventListener('dataavailable', onData)
      microphone.start(250)
    }

    return () => {
      console.log('Removing event listeners')
      connection.removeListener(
        LiveTranscriptionEvents.Transcript,
        onTranscript
      )
      microphone.removeEventListener('dataavailable', onData)

    }
  }, [connectionState])

  useEffect(() => {
    if (!connection) return

    if (
      microphone?.state === 'recording' &&
      connectionState === SOCKET_STATES.open
    ) {
      connection.keepAlive()
      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    }
  }, [connectionState])

  const toggleMicrophone = async () => {
    if (!deepgramKey) {
      setSettingsOpen(true)
      return
    }

    if (connectionState === SOCKET_STATES.open) {
      disconnectFromDeepgram()
      microphone?.stop()
      mediaStream?.getTracks().forEach(track => track.stop())
      setMediaStream(null)
      setMicrophone(null)
    } else {
      await setupMicrophone()
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

  const handleExport = () => {
    const content = transcriptions
      .map((t) => `[${t.timestamp}] ${t.text}`)
      .join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcription-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [transcriptions])

  // Save transcriptions to localStorage whenever they change
  useEffect(() => {
    if (transcriptions.length > 0) {
      localStorage.setItem('transcriptions', JSON.stringify(transcriptions))
    }
  }, [transcriptions])

  const handleClear = () => {
    setTranscriptions([])
    localStorage.removeItem('transcriptions')
  }

  // Move localStorage check to useEffect
  useEffect(() => {
    const savedTranscriptions = localStorage.getItem('transcriptions')
    if (savedTranscriptions) {
      setTranscriptions(JSON.parse(savedTranscriptions))
    }
  }, [])

  return (
    <>
      <div className="flex flex-col h-full rounded-lg border">
        <div className="flex-1 overflow-hidden p-4">
          <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-200px)]">
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
          <Button
            onClick={handleClear}
            variant="destructive"
            className="flex items-center"
            disabled={transcriptions.length === 0}>
            <Trash2 className="mr-2" /> Clear
          </Button>
          <Button onClick={toggleMicrophone} className="flex items-center">
            {connectionState === SOCKET_STATES.open ? (
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
          <Button
            onClick={handleExport}
            className="flex items-center"
            disabled={transcriptions.length === 0}>
            <Download className="mr-2" /> Export
          </Button>
        </div>
      </div>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}

export default VoiceRecorder
