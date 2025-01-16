import React, { createContext, useContext, useState } from 'react'
import { Document } from 'langchain/document'
import { DocumentLoader } from '@/utils/documentLoader'

interface FileContextType {
  files: File[]
  documents: Document[]
  addFiles: (newFiles: File[]) => Promise<void>
  removeFile: (fileName: string) => void
  clear: () => void
}

const FileContext = createContext<FileContextType | undefined>(undefined)

export function FileContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [files, setFiles] = useState<File[]>([])
  const [documents, setDocuments] = useState<Document[]>([])

  const addFiles = async (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles])
    const docs = await DocumentLoader.loadMultipleFiles(newFiles)
    setDocuments((prev) => [...prev, ...docs])
  }

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName))
    setDocuments((prev) =>
      prev.filter((doc) => !doc.metadata.source?.includes(fileName))
    )
  }

  const clear = () => {
    setFiles([])
    setDocuments([])
  }

  return (
    <FileContext.Provider
      value={{ files, documents, addFiles, removeFile, clear }}>
      {children}
    </FileContext.Provider>
  )
}

export function useFileContext() {
  const context = useContext(FileContext)
  if (context === undefined) {
    throw new Error('useFileContext must be used within a FileContextProvider')
  }
  return context
}
