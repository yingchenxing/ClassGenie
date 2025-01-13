import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function MarkdownEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit
    ],
    content: `
      # Welcome to the Markdown Editor
      
      You can write markdown here:
      
      - List item 1
      - List item 2
      
      **Bold text** and *italic text*
    `,
    editorProps: {
      attributes: {
        class: 'prose mx-auto focus:outline-none p-4 leading-tight h-full'
      }
    }
  })

  return (
    <ScrollArea className="border rounded-lg h-full w-full flex flex-col">
      <EditorContent editor={editor} />
    </ScrollArea>
  )
}