"use client"

import VoiceRecorder from "@/components/audio/VoiceRecorder"
import { AppSidebar } from "@/components/nav/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { MicrophoneContextProvider } from "./context/MicrophoneContextProvider"
import { DeepgramContextProvider } from "./context/DeepgramContextProvider"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MarkdownEditor from "@/components/panel/markdownEditor"

export default function Page() {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>Hello World! 🌎️</p>',
  })

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-[95vh] overflow-y-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2">
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
        </header>
        <ResizablePanelGroup className="flex flex-1 flex-col gap-1 p-4 pt-0" direction="horizontal">
          <ResizablePanel>
            <MicrophoneContextProvider>
              <DeepgramContextProvider>
                <VoiceRecorder />
              </DeepgramContextProvider>
            </MicrophoneContextProvider>
          </ResizablePanel>

          <ResizableHandle className="w-0" />
          <ResizablePanel>
            {/* <div className="h-full w-full rounded-xl bg-muted/50" /> */}

            <MarkdownEditor />
          </ResizablePanel>
        </ResizablePanelGroup>

      </SidebarInset>
    </SidebarProvider>
  )
}
