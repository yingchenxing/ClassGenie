import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useProjectEnv } from '@/app/context/ProjectEnvContextProvider'
import { useEffect } from 'react'
import MarkdownIt from 'markdown-it'
import { Button } from '@/components/ui/button'
import TurndownService from 'turndown'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code,
  Download,
  LucideIcon,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const md = new MarkdownIt()

interface ToolbarButtonProps {
  title: string
  icon: LucideIcon
  onClick: () => void
  isActive?: boolean
}

function ToolbarButton({
  title,
  icon: Icon,
  onClick,
  isActive = false,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`p-2 ${isActive ? 'bg-muted' : ''}`}
          onClick={onClick}>
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  )
}

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

  const handleExport = () => {
    if (!editor) return

    const turndown = new TurndownService()
    const markdown = turndown.turndown(editor.getHTML())
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'content.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!editor) {
    return null
  }

  return (
    <ScrollArea className="border rounded-lg h-full w-full flex flex-col">
      <div className="border-b p-2 flex gap-1 flex-wrap">
        <ToolbarButton
          title="Bold"
          icon={Bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        />
        <ToolbarButton
          title="Italic"
          icon={Italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        />
        <ToolbarButton
          title="Heading 1"
          icon={Heading1}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive('heading', { level: 1 })}
        />
        <ToolbarButton
          title="Heading 2"
          icon={Heading2}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive('heading', { level: 2 })}
        />
        <ToolbarButton
          title="Bullet List"
          icon={List}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        />
        <ToolbarButton
          title="Numbered List"
          icon={ListOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        />
        <ToolbarButton
          title="Blockquote"
          icon={Quote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
        />
        <ToolbarButton
          title="Code"
          icon={Code}
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
        />
        <ToolbarButton
          title="Export Markdown"
          icon={Download}
          onClick={handleExport}
        />
      </div>
      <EditorContent editor={editor} />
    </ScrollArea>
  )
}
