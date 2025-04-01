// // app/api/validate-xml/route.ts
// import { validateXML } from 'xsd-schema-validator';
// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   const { xml, schemaName } = await req.json();
  
//   try {
//     const result = await validateXML(xml, `public/schemas/${schemaName}.xsd`);
//     return NextResponse.json({
//       isValid: result.valid,
//       errors: result.messages || []
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Validation failed' },
//       { status: 500 }
//     );
//   }
// }