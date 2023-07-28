export interface IPDFRawData {
    Transcoder: string
    Meta: Meta
    Pages: Page[]
  }
  
  export interface Meta {
    PDFFormatVersion: string
    IsAcroFormPresent: boolean
    IsXFAPresent: boolean
    Producer: string
    CreationDate: string
    Metadata: Metadata
  }
  
  export interface Metadata {}
  
  export interface Page {
    Width: number
    Height: number
    HLines: any[]
    VLines: any[]
    Fills: Fill[]
    Texts: Text[]
    Fields: any[]
    Boxsets: any[]
  }
  
  export interface Fill {
    x: number
    y: number
    w: number
    h: number
    clr: number
  }
  
  export interface Text {
    x: number
    y: number
    w: number
    sw: number
    A: string
    R: R[]
  }
  
  export interface R {
    T: string
    S: number
    TS: number[]
  }