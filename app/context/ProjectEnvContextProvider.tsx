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
  const [summary, setSummary] = useState<string>('')

  return (
    <ProjectEnvContext.Provider
      value={{
        summary,
        setSummary,
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
