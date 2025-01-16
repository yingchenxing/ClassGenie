import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'
interface FileWithProgress extends File {
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
}

export function FileInput() {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(
      'Accepted files:',
      acceptedFiles.map((f) => ({ name: f.name, size: f.size }))
    )

    const newFiles = acceptedFiles.map((file) => ({
      ...file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading' as const,
    }))
    setFiles((prev) => [...prev, ...newFiles])

    // Simulate processing for each file
    newFiles.forEach((file) => {
      simulateFileProcessing(file)
    })
  }, [])

  const simulateFileProcessing = (file: FileWithProgress) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name
            ? {
                ...f,
                progress,
                status: progress === 100 ? 'complete' : 'processing',
              }
            : f
        )
      )
      if (progress >= 100) {
        clearInterval(interval)
        toast({
          title: 'File Upload Success',
          description: `${file.name} has been uploaded successfully`,
        })
      }
    }, 200)
  }

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  })

  return (
    <div className="flex flex-col h-full">
      {/* Drop zone area */}
      <div
        {...getRootProps()}
        className={`
          flex-1 border-2 border-dashed rounded-lg
          flex items-center justify-center
          min-h-[200px] mb-4 p-4
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted'}
        `}>
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop files here, or click to select files'}
          </p>
        </div>
      </div>

      {/* File list */}
      <ScrollArea className="flex-1 border rounded-lg p-4">
        <div className="space-y-4">
          {files.map((file) => (
            <div key={file.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {typeof file.size === 'number' && file.size > 0
                      ? file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(2)} KB`
                        : `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                      : '0 KB'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file.name)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Progress value={file.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {file.status.charAt(0).toUpperCase() + file.status.slice(1)}...
                {file.progress}%
              </p>
            </div>
          ))}
          {files.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No files uploaded
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
