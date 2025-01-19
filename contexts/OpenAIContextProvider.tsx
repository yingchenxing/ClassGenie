'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FunctionComponent,
  useEffect,
} from 'react'

interface OpenAIKeyContextType {
  openaiKey: string
  setOpenaiKey: (key: string) => void
}

const OpenAIKeyContext = createContext<OpenAIKeyContextType | undefined>(
  undefined
)

interface OpenAIKeyProviderProps {
  children: ReactNode
}

const OpenAIKeyProvider: FunctionComponent<OpenAIKeyProviderProps> = ({
  children,
}) => {
  const [openaiKey, setOpenaiKey] = useState<string>('')

  // Load key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai-api-key')
    if (savedKey) {
      setOpenaiKey(savedKey)
    }
  }, [])

  // Update localStorage when key changes
  useEffect(() => {
    if (openaiKey) {
      localStorage.setItem('openai-api-key', openaiKey)
    }
  }, [openaiKey])

  return (
    <OpenAIKeyContext.Provider
      value={{
        openaiKey,
        setOpenaiKey,
      }}>
      {children}
    </OpenAIKeyContext.Provider>
  )
}

function useOpenAIKey(): OpenAIKeyContextType {
  const context = useContext(OpenAIKeyContext)
  if (context === undefined) {
    throw new Error('useOpenAIKey must be used within a OpenAIKeyProvider')
  }
  return context
}

export { OpenAIKeyProvider, useOpenAIKey }
