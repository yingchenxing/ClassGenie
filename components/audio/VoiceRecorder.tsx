"use client";

import { useEffect, useRef, useState } from "react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "@/app/context/DeepgramContextProvider";
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "@/app/context/MicrophoneContextProvider";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Sparkles } from "lucide-react";

const VoiceRecorder: () => JSX.Element = () => {
  const [caption, setCaption] = useState<string | undefined>("Powered by Deepgram");
  const [transcriptions, setTranscriptions] = useState<{ text: string; timestamp: string }[]>([]);
  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, stopMicrophone, microphoneState } = useMicrophone();

  useEffect(() => {
    setupMicrophone();
  }, []);

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
    }
  }, [microphoneState]);

  useEffect(() => {
    if (!microphone || !connection) return;

    const onData = (e: BlobEvent) => {
      if (e.data.size > 0) {
        console.log("Sending data to Deepgram");
        connection?.send(e.data);
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      console.log("Received transcript:", data);
      const { is_final: isFinal, speech_final: speechFinal } = data;
      let thisCaption = data.channel.alternatives[0].transcript;

      if (thisCaption !== "") {
        setCaption(thisCaption);
        if (isFinal) {
          const timestamp = new Date().toLocaleTimeString();
          setTranscriptions((prev) => [...prev, { text: thisCaption, timestamp }]);
        }
      }


    };

    if (connectionState === LiveConnectionState.OPEN) {
      console.log("Adding event listeners");
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);
    }

    return () => {
      console.log("Removing event listeners");
      if (connection) {
        connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      }
      if (microphone) {
        microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      }
    };
  }, [connection, microphone, connectionState]);

  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();
    }


  }, [microphoneState, connectionState]);

  const toggleMicrophone = () => {
    if (microphoneState === MicrophoneState.Open) {
      stopMicrophone();
    } else {
      startMicrophone();
    }
  };

  const handleSummarize = () => {
    console.log("Summarizing transcriptions:", transcriptions);
  };

  return (
    <>
      <div className="flex flex-col flex-auto h-full overflow-y-auto rounded-lg border  p-4">
        <div className="relative w-full h-full">
          <ul>
            {transcriptions.map((transcription, index) => (
              <li key={index} className="bg-gray-100 p-2 my-1 rounded">
                <span className="text-xs text-gray-500 block">{transcription.timestamp}</span>
                <span>{transcription.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center gap-2">
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
            disabled={transcriptions.length === 0}
          >
            <Sparkles className="mr-2" /> Summarize
          </Button>
        </div>
      </div>

    </>
  );
};

export default VoiceRecorder;