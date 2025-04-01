# ParseFlow: PDF-to-XML Converter ✨

[![Next.js](https://img.shields.io/badge/Next.js-13.4+-black?logo=next.js)](https://nextjs.org/) 
[![Firebase](https://img.shields.io/badge/Firebase-9.22+-orange?logo=firebase)](https://firebase.google.com) 
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](https://www.typescriptlang.org/)

A full-stack web application that converts PDF documents to structured XML while preserving layout and formatting, featuring user authentication, conversion history, and real-time processing.

![Dashboard Preview](/screenshots/dashboard-preview.png)

## 🚀 Features

### Core Functionality
- **Secure JWT Authentication** with email/password
- **Advanced PDF Parsing** preserving:
  - Headers/paragraph structure
  - Basic table layouts
  - Text styling and positioning
- **Interactive Viewer** with dual PDF/XML preview
- **Conversion History** with search/filter capabilities
- **Real-time Progress Tracking** during conversion
- **Responsive Design** optimized for mobile devices

### Technical Highlights
- Client-side PDF processing with Web Workers
- Custom XML schema with layout metadata
- Dark/light theme support
- File validation and error handling
- Conversion statistics and analytics

## 🛠 Technology Stack

### Frontend
| Technology       | Purpose                          | Key Benefit                          |
|------------------|----------------------------------|--------------------------------------|
| Next.js 13       | Framework & SSR                  | Optimized routing + API endpoints    |
| TypeScript 5     | Type-safe development            | Enhanced code quality + maintenance  |
| Tailwind CSS     | Styling system                   | Rapid UI development + theming       |
| Framer Motion    | Animations                       | Smooth UX transitions                |

### Backend Services
| Technology       | Usage                            | Rationale                            |
|------------------|----------------------------------|--------------------------------------|
| Firebase Auth    | User management                  | Secure JWT implementation            |
| Firestore        | Data storage                     | Real-time updates + scalability      |
| pdfjs-dist       | PDF parsing                      | Accurate text extraction + metadata  |

**Why This Stack?**
- **Firebase over Traditional Backend**: Eliminates server management while maintaining security through Firebase Rules
- **Client-side Processing**: Reduces server costs and improves scalability
- **Next.js Optimization**: Automatic code splitting and SSG capabilities

## 🏁 Getting Started

### Prerequisites
- Node.js v18+
- Firebase account
- npm v9+

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/pdf-to-xml-converter.git
cd pdf-to-xml-converter
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Firebase**
Create `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Run Development Server**
```bash
npm run dev
```

## 🔍 PDF-to-XML Conversion Process

### Technical Approach

#### PDF Parsing
```typescript
const parsePDF = async (file: File) => {
  const pdf = await pdfjs.getDocument(await file.arrayBuffer()).promise;
  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();
  // Extract text with coordinates and styles
};
```

#### Structure Detection
- **Headers**: Font size analysis (>150% body text)
- **Paragraphs**: Line proximity grouping (≤15px vertical gap)
- **Tables**: Grid pattern detection (aligned columns)

#### XML Generation
```xml
<document>
  <page number="1" width="612" height="792">
    <header level="1" x="72" y="680">
      <text font="Helvetica-Bold" size="24">Document Title</text>
    </header>
    <paragraph spacing="18">
      <line x="72" y="650">First paragraph line</line>
    </paragraph>
  </page>
</document>
```

## ⚠️ Limitations

### Current Constraints
- **File Types**: Text-based PDFs only (no scanned documents)
- **Layout Complexity**:
  - Multi-column layouts may merge
  - Nested tables not supported
- **Performance**: Files >50 pages may slow browser
- **Text Recognition**: No OCR capabilities

### Assumptions
- PDFs use standard Western text direction
- Primary content is textual (minimal images)
- Users have modern browsers (Chrome/Firefox/Edge)

## 🚧 Future Improvements

### Near-Term Roadmap
- **OCR Integration**: Tesseract.js for scanned documents
- **Enhanced Tables**: CSV-style XML output with cell detection
- **Performance Boost**: Web Workers for heavy processing
- **Collaboration**: Shared conversions with permission levels

### Long-Term Vision
- **AI Layout Analysis**: ML models for complex layouts
- **Version Control**: Git-style conversion history
- **PDF Preview**: React-pdf integration
- **Bulk Processing**: Queue system for multiple files