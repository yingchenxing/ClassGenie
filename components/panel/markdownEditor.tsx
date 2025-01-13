import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useProjectEnv } from '@/app/context/ProjectEnvContextProvider'
import { useEffect } from 'react'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

export default function MarkdownEditor() {
  const { summary } = useProjectEnv()

  const editor = useEditor({
    extensions: [StarterKit, Typography],
    editorProps: {
      attributes: {
        class: 'prose mx-auto focus:outline-none p-4 leading-tight h-full',
      },
    },
    content: summary ? md.render(summary) : '',
  })

  useEffect(() => {
    if (editor && summary) {
      editor.commands.setContent(md.render(summary))
    }
  }, [editor, summary])

  return (
    <ScrollArea className="border rounded-lg h-full w-full flex flex-col">
      <EditorContent editor={editor} />
    </ScrollArea>
  )
}
