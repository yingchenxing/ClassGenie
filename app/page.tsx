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


export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
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

          <ResizableHandle />
          <ResizablePanel>
            <div className="h-full w-full rounded-xl bg-muted/50" />
          </ResizablePanel>
        </ResizablePanelGroup>

      </SidebarInset>
    </SidebarProvider>
  )
}