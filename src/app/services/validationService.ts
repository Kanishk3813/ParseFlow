// src/services/validationService.ts
export async function validateXmlAgainstXSD(xml: string, schemaName: string) {
    try {
      const response = await fetch('/api/validate-xml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ xml, schemaName }),
      });
  
      if (!response.ok) throw new Error('Validation request failed');
      
      return await response.json();
    } catch (error) {
      return {
        isValid: false,
        errors: ['Validation service unavailable']
      };
    }
  }