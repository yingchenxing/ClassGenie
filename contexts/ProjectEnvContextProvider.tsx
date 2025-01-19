'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FunctionComponent,
} from 'react'

interface ProjectEnvContextType {
  summary: string
  setSummary: (content: string) => void
}

const ProjectEnvContext = createContext<ProjectEnvContextType | undefined>(
  undefined
)

interface ProjectEnvContextProviderProps {
  children: ReactNode
}

const ProjectEnvContextProvider: FunctionComponent<
  ProjectEnvContextProviderProps
> = ({ children }) => {
  const [summary, setSummary] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('projectSummary') || ''
    }
    return ''
  })

  const handleSetSummary = (content: string) => {
    setSummary(content)
    if (typeof window !== 'undefined') {
      localStorage.setItem('projectSummary', content)
    }
  }

  return (
    <ProjectEnvContext.Provider
      value={{
        summary,
        setSummary: handleSetSummary,
      }}>
      {children}
    </ProjectEnvContext.Provider>
  )
}

function useProjectEnv(): ProjectEnvContextType {
  const context = useContext(ProjectEnvContext)
  if (context === undefined) {
    throw new Error(
      'useProjectEnv must be used within a ProjectEnvContextProvider'
    )
  }
  return context
}

export { ProjectEnvContextProvider, useProjectEnv }
