import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

export class DocumentLoader {
  private static async splitDocuments(
    docs: Document[],
    chunkSize: number = 1000
  ) {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap: 200,
    })
    return await textSplitter.splitDocuments(docs)
  }

  static async loadFile(file: File, chunkSize?: number): Promise<Document[]> {
    const blob = new Blob([file], { type: file.type })
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    let docs: Document[] = []

    try {
      switch (fileExtension) {
        case 'pdf':
          const pdfLoader = new PDFLoader(blob)
          docs = await pdfLoader.load()
          break
        case 'txt':
          const textLoader = new TextLoader(blob)
          docs = await textLoader.load()
          break
        case 'docx':
          const docxLoader = new DocxLoader(blob)
          docs = await docxLoader.load()
          break
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`)
      }

      return chunkSize ? await this.splitDocuments(docs, chunkSize) : docs
    } catch (error) {
      console.error('Error loading document:', error)
      throw error
    }
  }

  static async loadMultipleFiles(
    files: File[],
    chunkSize?: number
  ): Promise<Document[]> {
    try {
      const allDocs = await Promise.all(
        files.map((file) => this.loadFile(file, chunkSize))
      )
      return allDocs.flat()
    } catch (error) {
      console.error('Error loading multiple documents:', error)
      throw error
    }
  }
}
