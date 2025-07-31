import { DocumentTypeName } from "@/lib/document-config";

const API_BASE_URL = process.env.SPRING_API_URL;

if (!API_BASE_URL) {
  throw new Error("SPRING_API_URL environment variable is not configured");
}

/**
 * Constructs the complete API URL for a given document type
 * @param documentType - The type of document to get the API URL for
 * @returns The complete API URL for the document type
 * @throws Error if the document type is not supported
 */
export function getBaseUrlByDocumentType(documentType: DocumentTypeName): string {
  switch (documentType) {
    case DocumentTypeName.INVOICE:
      return `${API_BASE_URL}/api/invoice`;
    
    case DocumentTypeName.BILL_OF_LADING:
      return `${API_BASE_URL}/api/bill-of-lading`;
    
    default:
      throw new Error(`Unsupported document type: ${documentType}`);
  }
}