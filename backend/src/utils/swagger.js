import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FinSecure API",
      version: "1.0.0",
      description: "Finance Backend with RBAC and Analytics",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],

    tags: [
      { name: "Auth", description: "Authentication APIs" },
      { name: "Records", description: "Financial Records APIs" }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;