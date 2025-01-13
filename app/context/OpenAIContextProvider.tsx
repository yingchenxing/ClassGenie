'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FunctionComponent,
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
