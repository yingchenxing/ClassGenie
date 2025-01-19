'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ExternalLink } from 'lucide-react'
import { useOpenAIKey } from '@/contexts/OpenAIContextProvider'
import { useDeepgram } from '@/contexts/DeepgramContextProvider'

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { deepgramKey, setDeepgramKey } = useDeepgram()
  const { openaiKey, setOpenaiKey } = useOpenAIKey()

  const handleSave = () => {
    if (openaiKey) {
      localStorage.setItem('openai-api-key', openaiKey)
    }
    if (deepgramKey) {
      localStorage.setItem('deepgram-api-key', deepgramKey)
    }
    onOpenChange(false)
  }

  useEffect(() => {
    const savedKey = localStorage.getItem('openai-api-key')
    const savedDeepgramKey = localStorage.getItem('deepgram-api-key')
    if (savedKey) {
      setOpenaiKey(savedKey)
    }
    if (savedDeepgramKey) {
      setDeepgramKey(savedDeepgramKey)
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <Input
              id="api-key"
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="deepgram-key">Deepgram API Key</Label>
              <a
                href="https://console.deepgram.com/project"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <Input
              id="deepgram-key"
              type="password"
              value={deepgramKey || ''}
              onChange={(e) => setDeepgramKey(e.target.value)}
              placeholder="Enter your Deepgram API key"
            />
          </div>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
