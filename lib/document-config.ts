// Configuration for different document types and their endpoints
export interface DocumentTypeConfig {
  id: string;
  name: DocumentTypeName;
  description: string;
}
// types.ts or constants.ts
export enum DocumentTypeName {
  INVOICE = "Invoice",
  BILL_OF_LADING = "Bill of Lading",
}

export const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  {
    id: "invoice",
    name: DocumentTypeName.INVOICE,
    description: "Process invoice documents",
  },
  {
    id: "bill-of-lading",
    name: DocumentTypeName.BILL_OF_LADING,
    description: "Process bill of lading documents",
  },

 
]

// Default document type
export const DEFAULT_DOCUMENT_TYPE = DOCUMENT_TYPES[0]
