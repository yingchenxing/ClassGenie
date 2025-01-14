"use client"

import VoiceRecorder from "@/components/audio/VoiceRecorder"
import { AppSidebar } from "@/components/nav/app-sidebar"
import { SettingsDialog } from "@/components/nav/settings-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Settings } from "lucide-react"
import { useState } from "react"
import { MicrophoneContextProvider } from "./context/MicrophoneContextProvider"
import { DeepgramContextProvider } from "./context/DeepgramContextProvider"
import MarkdownEditor from "@/components/panel/markdownEditor"

export default function Page() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <SidebarProvider>
      {/* <AppSidebar /> */}
      <SidebarInset className="h-[95vh] overflow-y-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    New Project
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Open settings</span>
            </Button>
          </div>
        </header>
        <ResizablePanelGroup className="flex flex-1 flex-col gap-1 p-4 pt-0" direction="horizontal">
          <ResizablePanel>

            <VoiceRecorder />
          </ResizablePanel>

          <ResizableHandle className="w-0" />
          <ResizablePanel>
            {/* <div className="h-full w-full rounded-xl bg-muted/50" /> */}

            <MarkdownEditor />
          </ResizablePanel>
        </ResizablePanelGroup>

        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </SidebarInset>
    </SidebarProvider>
  )
}
