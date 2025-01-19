import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useProjectEnv } from '@/contexts/ProjectEnvContextProvider'
import { useEffect } from 'react'
import MarkdownIt from 'markdown-it'
import { Button } from '@/components/ui/button'
import TurndownService from 'turndown'
import {
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Quote,
  Code2,
  FileCode,
  Download,
  LucideIcon,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

const md = new MarkdownIt()
const lowlight = createLowlight(common)

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
  const { summary, setSummary } = useProjectEnv()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Typography,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose mx-auto focus:outline-none p-4 leading-tight h-full',
      },
    },
    content: summary ? md.render(summary) : '',
    onUpdate: ({ editor }) => {
      const turndown = new TurndownService()
      const markdown = turndown.turndown(editor.getHTML())
      setSummary(markdown)
    },
  })

  useEffect(() => {
    if (editor && summary) {
      const { from, to } = editor.state.selection

      editor.commands.setContent(md.render(summary))

      editor.commands.setTextSelection({ from, to })
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
    <div className="border rounded-lg h-full w-full flex flex-col">
      <div className="border-b p-2 flex gap-1 flex-wrap items-center">
        <div className="flex gap-1">
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
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex gap-1">
          <ToolbarButton
            title="Heading 1"
            icon={Heading}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive('heading', { level: 1 })}
          />
          <ToolbarButton
            title="Heading 2"
            icon={Heading}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive('heading', { level: 2 })}
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex gap-1">
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
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex gap-1">
          <ToolbarButton
            title="Inline Code"
            icon={Code2}
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
          />
          <ToolbarButton
            title="Code Block"
            icon={FileCode}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
          />
        </div>

        <div className="flex-1" />

        <ToolbarButton
          title="Export Markdown"
          icon={Download}
          onClick={handleExport}
        />
      </div>

      <ScrollArea className="h-full w-full flex flex-col">
        <EditorContent editor={editor} />
      </ScrollArea>
    </div>
  )
}
