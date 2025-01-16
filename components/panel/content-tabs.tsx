'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import MarkdownEditor from './markdownEditor'
import { FileText, Code2, FileIcon } from 'lucide-react'
import { FileInput } from './fileInput'
export function ContentTabs() {
  return (
    <Tabs defaultValue="notes" className="h-full flex flex-col">
      <TabsList className="grid grid-cols-2 shrink-0">
        <TabsTrigger value="notes" className="flex gap-2">
          <FileText className="h-4 w-4" />
          Notes
        </TabsTrigger>
        <TabsTrigger value="code" className="flex gap-2">
          <FileIcon className="h-4 w-4" />
          Files
        </TabsTrigger>
      </TabsList>
      <TabsContent value="notes" className="h-full mt-4 overflow-auto flex-1">
        <MarkdownEditor />
      </TabsContent>
      <TabsContent value="code" className="mt-4 overflow-auto flex-1">
        <FileInput />
      </TabsContent>
    </Tabs>
  )
}
