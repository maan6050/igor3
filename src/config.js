export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "notes-app-uploads"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://5by75p4gn3.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_oNG1T2uXF",
    APP_CLIENT_ID: "70rdj3o7135a0had4f497jfhhd",
    IDENTITY_POOL_ID: "us-east-1:cf447d32-2d5a-48a4-8457-2e35e724bed6"
  },
  social: {
    FB: "269127930865128",
    GOOGLE: "377405085854-hne2rlp10nok1cuf61fks91kofgluc35.apps.googleusercontent.com"
  }
};
