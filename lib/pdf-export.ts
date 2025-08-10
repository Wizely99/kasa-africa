// import { ProcessorResults } from "@/features/documents/types/return3"
// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"

// // interface FieldData {
// //   value: string | string[]
// //   confidenceScore: number
// //   isInferred: boolean
// //   comments: string[]
// // }

// // interface ProcessorResults {
// //   fields: Record<string, FieldData>
// //   metadata: {
// //     id: string
// //     createdAt: number
// //     updatedAt: number
// //     modelId: string
// //     documentSize: number
// //     documentName: string
// //     pageCount: number
// //     aggregateScore: number
// //     nullCount: number
// //     nullEssentialCount: number
// //     extractedCount: number
// //     flaggedCount: number
// //     flaggedEssentialCount: number
// //     otherStats: Record<string, any>
// //     responseTime: number
// //   }
// // }

// export async function exportToPDF(results: ProcessorResults) {
//   // Create new PDF document
//   const doc:jsPDF = new jsPDF()
// const filename=results.metadata.documentName;
//   // Set document properties
//   doc.setProperties({
//     title: `Results for ${results.metadata.documentName}`,
//     subject: "PDF Document Processing Results",
//     author: "idtech",
//     creator: "PDF Document Processor",
//   })

//   // Add header
//   doc.setFontSize(20)
//   doc.setTextColor(40, 40, 40)
//   doc.text("Document Processing Results", 20, 25)

//   // Add document info
//   doc.setFontSize(12)
//   doc.setTextColor(100, 100, 100)
//   doc.text(`Document: ${results.metadata.documentName}`, 20, 35)
//   doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 42)
//   doc.text(`Model ID: ${results.metadata.modelId}`, 20, 49)

//   // Calculate summary statistics
//   const totalFields = results.metadata.extractedCount
//   const averageAccuracy = results.metadata.aggregateScore
//   const fieldsWithComments = Object.values(results.fields).filter(field => field.comments.length > 0).length
//   const inferredFields = Object.values(results.fields).filter(field => field.isInferred).length
//   const highAccuracyFields = Object.values(results.fields).filter(field => field.confidenceScore >= 95).length
//   const lowAccuracyFields = Object.values(results.fields).filter(field => field.confidenceScore < 70).length

//   // Add summary section
//   doc.setFontSize(14)
//   doc.setTextColor(40, 40, 40)
//   doc.text("Summary", 20, 62)

//   const summaryData = [
//     ["Total Fields Extracted", totalFields.toString()],
//     ["Average Accuracy", `${averageAccuracy}%`],
//     ["High Accuracy Fields (≥95%)", highAccuracyFields.toString()],
//     ["Low Accuracy Fields (<70%)", lowAccuracyFields.toString()],
//     ["Inferred Fields", inferredFields.toString()],
//     ["Fields with Comments", fieldsWithComments.toString()],
//     ["Null Count", results.metadata.nullCount.toString()],
//     ["Flagged Count", results.metadata.flaggedCount.toString()],
//     ["Document Size", `${(results.metadata.documentSize / 1024).toFixed(1)} KB`],
//     ["Page Count", results.metadata.pageCount.toString()],
//     ["Response Time", `${(results.metadata.responseTime / 1000).toFixed(2)}s`],
//   ]

//   autoTable(doc, {
//     startY: 67,
//     head: [["Metric", "Value"]],
//     body: summaryData,
//     theme: "grid",
//     headStyles: { fillColor: [66, 139, 202] },
//     styles: { fontSize: 10 },
//     margin: { left: 20, right: 20 },
//   })

//   // Add detailed results section
//   const finalY = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY || 150

//   doc.setFontSize(14)
//   doc.setTextColor(40, 40, 40)
//   doc.text("Field Details", 20, finalY + 15)

//   // Prepare data for the main results table
//   const tableData = Object.entries(results.fields).map(([fieldName, fieldData], index) => {
//     let value = ""

//     if (Array.isArray(fieldData.value)) {
//       value = `[${fieldData.value.length} items]: ${fieldData.value
//         .slice(0, 2)
//         .map(item => String(item))
//         .join(", ")}${fieldData.value.length > 2 ? "..." : ""}`
//     } else {
//       value = String(fieldData.value)
//     }

//     // Truncate long values
//     if (value.length > 40) {
//       value = value.substring(0, 37) + "..."
//     }
// const commentsLength=fieldData.comments.length;
//     const commentsText = commentsLength > 0 
//       ? `${commentsLength} ${commentsLength>1?"comments":"comment"}: ${fieldData.comments.join(", ")}`
//       : "None"

//     return [
//       (index + 1).toString(),
//       fieldName,
//       value,
//       `${fieldData.confidenceScore}%`,
//       fieldData.isInferred ? "Yes" : "No",
//       commentsText.length > 50 ? commentsText.substring(0, 47) + "..." : commentsText
//     ]
//   })

//   autoTable(doc, {
//     startY: finalY + 20,
//     head: [["#", "Field Name", "Value", "Confidence", "Inferred", "Comments"]],
//     body: tableData,
//     theme: "striped",
//     headStyles: { fillColor: [66, 139, 202] },
//     styles: {
//       fontSize: 8,
//       cellPadding: 3,
//       overflow: "linebreak",
//       cellWidth: "wrap",
//     },
//     columnStyles: {
//       0: { cellWidth: 10 }, // #
//       1: { cellWidth: 35 }, // Field Name
//       2: { cellWidth: 45 }, // Value
//       3: { cellWidth: 20 }, // Confidence
//       4: { cellWidth: 18 }, // Inferred
//       5: { cellWidth: 52 }, // Comments
//     },
//     margin: { left: 20, right: 20 },
//     didParseCell: (data) => {
//       // Color code the confidence column based on percentage
//       if (data.column.index === 3 && data.section === "body") {
//         const confidence = Number.parseInt(data.cell.text[0].replace("%", ""))
//         if (confidence >= 95) {
//           data.cell.styles.textColor = [34, 139, 34] // Green
//           data.cell.styles.fillColor = [240, 255, 240] // Light green background
//         } else if (confidence >= 85) {
//           data.cell.styles.textColor = [0, 100, 200] // Blue
//         } else if (confidence >= 70) {
//           data.cell.styles.textColor = [255, 140, 0] // Orange
//         } else {
//           data.cell.styles.textColor = [220, 20, 60] // Red
//           data.cell.styles.fillColor = [255, 240, 240] // Light red background
//         }
//       }

//       // Color code the inferred column
//       if (data.column.index === 4 && data.section === "body") {
//         if (data.cell.text[0] === "Yes") {
//           data.cell.styles.textColor = [255, 140, 0] // Orange
//           data.cell.styles.fillColor = [255, 248, 220] // Light orange background
//         }
//       }

//       // Color code the comments column
//       if (data.column.index === 5 && data.section === "body") {
//         const text = data.cell.text[0]
//         if (text !== "None" && !text.startsWith("0 comment")) {
//           data.cell.styles.textColor = [220, 20, 60] // Red for fields with comments
//           data.cell.styles.fillColor = [255, 235, 238] // Light red background
//         }
//       }
//     },
//   })

//   // Add detailed comments section if there are any
//   const fieldsWithDetailedComments = Object.entries(results.fields).filter(([, field]) => field.comments.length > 0)
  
//   if (fieldsWithDetailedComments.length > 0) {
//     const commentsFinalY = ((doc as unknown) as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY || 200

//     // Check if we need a new page
//     let startY = 0
//     if (commentsFinalY > 250) {
//       doc.addPage()
//       doc.setFontSize(14)
//       doc.setTextColor(40, 40, 40)
//       doc.text("Field Comments Details", 20, 25)
//       startY = 30
//     } else {
//       doc.setFontSize(14)
//       doc.setTextColor(40, 40, 40)
//       doc.text("Field Comments Details", 20, commentsFinalY + 15)
//       startY = commentsFinalY + 20
//     }

//     const commentsData: string[][] = []

//     fieldsWithDetailedComments.forEach(([fieldName, fieldData]) => {
//       fieldData.comments.forEach((comment) => {
//         commentsData.push([
//           fieldName,
//           `${fieldData.confidenceScore}%`,
//           fieldData.isInferred ? "Yes" : "No",
//           comment
//         ])
//       })
//     })

//     if (commentsData.length > 0) {
//       autoTable(doc, {
//         startY: startY,
//         head: [["Field Name", "Confidence", "Inferred", "Comment"]],
//         body: commentsData,
//         theme: "grid",
//         headStyles: { fillColor: [220, 53, 69] },
//         styles: {
//           fontSize: 9,
//           cellPadding: 4,
//           overflow: "linebreak",
//         },
//         columnStyles: {
//           0: { cellWidth: 40 }, // Field Name
//           1: { cellWidth: 25 }, // Confidence
//           2: { cellWidth: 20 }, // Inferred
//           3: { cellWidth: 95 }, // Comment
//         },
//         margin: { left: 20, right: 20 },
//         didParseCell: (data) => {
//           // Highlight low confidence fields
//           if (data.column.index === 1 && data.section === "body") {
//             const confidence = Number.parseInt(data.cell.text[0].replace("%", ""))
//             if (confidence < 70) {
//               data.cell.styles.textColor = [220, 20, 60] // Red
//               data.cell.styles.fillColor = [255, 235, 238] // Light red background
//             }
//           }
          
//           // Highlight inferred fields
//           if (data.column.index === 2 && data.section === "body") {
//             if (data.cell.text[0] === "Yes") {
//               data.cell.styles.textColor = [255, 140, 0] // Orange
//               data.cell.styles.fillColor = [255, 248, 220] // Light orange background
//             }
//           }
//         },
//       })
//     }
//   }

//   // Add metadata section on a new page
//   doc.addPage()
//   doc.setFontSize(14)
//   doc.setTextColor(40, 40, 40)
//   doc.text("Document Metadata", 20, 25)

//   const metadataData = [
//     ["Document ID", results.metadata.id],
//     ["Created At", new Date(results.metadata.createdAt * 1000).toLocaleString()],
//     ["Updated At", new Date(results.metadata.createdAt * 1000).toLocaleString()],
//     ["Model ID", results.metadata.modelId],
//     ["Document Name", results.metadata.documentName],
//     ["Document Size", `${(results.metadata.documentSize / 1024).toFixed(1)} KB`],
//     ["Page Count", results.metadata.pageCount.toString()],
//     ["Aggregate Score", `${results.metadata.aggregateScore}%`],
//     ["Null Count", results.metadata.nullCount.toString()],
//     ["Null Essential Count", results.metadata.nullEssentialCount.toString()],
//     ["Extracted Count", results.metadata.extractedCount.toString()],
//     ["Flagged Count", results.metadata.flaggedCount.toString()],
//     ["Flagged Essential Count", results.metadata.flaggedEssentialCount.toString()],
//     ["Response Time", `${(results.metadata.responseTime / 1000).toFixed(2)} seconds`],
//   ]

//   // Add other stats if they exist
//   if (results.metadata.otherStats) {
//     Object.entries(results.metadata.otherStats).forEach(([key, value]) => {
//       metadataData.push([key, String(value)])
//     })
//   }

//   autoTable(doc, {
//     startY: 30,
//     head: [["Property", "Value"]],
//     body: metadataData,
//     theme: "grid",
//     headStyles: { fillColor: [66, 139, 202] },
//     styles: { fontSize: 10 },
//     margin: { left: 20, right: 20 },
//     columnStyles: {
//       0: { cellWidth: 60 }, // Property
//       1: { cellWidth: 120 }, // Value
//     },
//   })

//   // Add footer with page numbers
//   const pageCount = doc.getNumberOfPages()
//   for (let i = 1; i <= pageCount; i++) {
//     doc.setPage(i)
//     doc.setFontSize(8)
//     doc.setTextColor(150, 150, 150)
//     doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10)
//   }

//   // Save the PDF
//   const baseFilename = filename.replace(/\.[^/.]+$/, "")
//   doc.save(`${baseFilename}_processing_results.pdf`)
// }
