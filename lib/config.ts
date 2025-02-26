const config = {
    env: {
      apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
      prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,
      databaseUrl: process.env.DATABASE_URL!,
      azureDocumentIntelligenceKey: process.env.NEXT_PUBLIC_AZURE_DOCUMENT_INTELLIGENCE_API_KEY!,
      azureDocumentIntelligenceEndpoint: process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT!,
      azureStorageAccountNameConnectionString: process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONNECTION_STRING!,
    },
  };
  
  export default config;