const paginationParams = [
  { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
  {
    name: "limit",
    in: "query",
    schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
  },
];

const paginationMeta = {
  type: "object",
  properties: {
    page: { type: "integer" },
    limit: { type: "integer" },
    total: { type: "integer" },
    totalPages: { type: "integer" },
    hasNext: { type: "boolean" },
    hasPrev: { type: "boolean" },
  },
};

const errorResponse = (description: string) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          error: { type: "string" },
          code: { type: "string" },
          requestId: { type: "string" },
        },
      },
    },
  },
});

const idParam = { name: "id", in: "path", required: true, schema: { type: "string" } };

function crudPaths(
  basePath: string,
  tag: string,
  createSchema: Record<string, unknown>,
  filterParams: Array<Record<string, unknown>> = [],
) {
  return {
    [basePath]: {
      get: {
        tags: [tag],
        summary: `List ${tag}`,
        parameters: [...paginationParams, ...filterParams],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { type: "object" } },
                    pagination: paginationMeta,
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: [tag],
        summary: `Create ${tag.slice(0, -1)}`,
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: createSchema } } },
        responses: { 201: { description: "Created" }, 401: errorResponse("Unauthorized") },
      },
    },
    [`${basePath}/{id}`]: {
      get: {
        tags: [tag],
        summary: `Get ${tag.slice(0, -1)} by ID`,
        parameters: [idParam],
        responses: { 200: { description: "Success" }, 404: errorResponse("Not found") },
      },
      patch: {
        tags: [tag],
        summary: `Update ${tag.slice(0, -1)}`,
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        requestBody: { required: true, content: { "application/json": { schema: createSchema } } },
        responses: {
          200: { description: "Updated" },
          401: errorResponse("Unauthorized"),
          404: errorResponse("Not found"),
        },
      },
      delete: {
        tags: [tag],
        summary: `Delete ${tag.slice(0, -1)}`,
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          200: { description: "Deleted" },
          401: errorResponse("Unauthorized"),
          404: errorResponse("Not found"),
        },
      },
    },
  };
}

const flatSchema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 255 },
    description: { type: "string" },
    city: { type: "string", minLength: 1, maxLength: 255 },
    locality: { type: "string", maxLength: 255 },
    address: { type: "string" },
    rent: { type: "integer", minimum: 1 },
    deposit: { type: "integer", minimum: 0 },
    flatType: {
      type: "string",
      enum: ["1bhk", "2bhk", "3bhk", "4bhk", "studio", "shared", "penthouse"],
    },
    furnishing: { type: "string", enum: ["furnished", "semi-furnished", "unfurnished"] },
    preferredGender: { type: "string", maxLength: 50 },
    amenities: { type: "string" },
    photos: { type: "string" },
    contactPhone: { type: "string", maxLength: 20 },
    availableFrom: { type: "string", format: "date-time" },
  },
  required: ["title", "city", "rent", "flatType", "furnishing"],
};

const flatmateSchema = {
  type: "object",
  properties: {
    city: { type: "string", minLength: 1, maxLength: 255 },
    locality: { type: "string", maxLength: 255 },
    budget: { type: "integer", minimum: 1 },
    description: { type: "string" },
    gender: { type: "string", maxLength: 50 },
    age: { type: "integer", minimum: 18, maximum: 100 },
    occupation: { type: "string", maxLength: 255 },
    smoking: { type: "string", enum: ["yes", "no", "occasionally"] },
    foodPref: { type: "string", enum: ["veg", "non-veg", "vegan", "no-preference"] },
    contactPhone: { type: "string", maxLength: 20 },
    moveInDate: { type: "string", format: "date-time" },
  },
  required: ["city", "budget"],
};

const equipmentSchema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 255 },
    description: { type: "string" },
    city: { type: "string", minLength: 1, maxLength: 255 },
    locality: { type: "string", maxLength: 255 },
    price: { type: "integer", minimum: 0 },
    category: {
      type: "string",
      enum: ["furniture", "electronics", "appliances", "kitchen", "fitness", "books", "other"],
    },
    condition: { type: "string", enum: ["new", "like-new", "good", "fair", "poor"] },
    photos: { type: "string" },
    sellerContact: { type: "string", maxLength: 20 },
  },
  required: ["title", "city", "price", "category", "condition"],
};

const serviceSchema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 255 },
    description: { type: "string" },
    city: { type: "string", minLength: 1, maxLength: 255 },
    locality: { type: "string", maxLength: 255 },
    serviceType: {
      type: "string",
      enum: [
        "maid",
        "cook",
        "cleaner",
        "laundry",
        "babysitter",
        "electrician",
        "plumber",
        "carpenter",
        "painter",
        "pest-control",
        "movers",
        "other",
      ],
    },
    contactName: { type: "string", maxLength: 255 },
    contactPhone: { type: "string", maxLength: 20 },
    experience: { type: "string", maxLength: 100 },
    availableTime: { type: "string", maxLength: 255 },
    monthlyCharge: { type: "integer", minimum: 0 },
    rating: { type: "string" },
  },
  required: ["title", "city", "serviceType"],
};

const eventSchema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 255 },
    description: { type: "string" },
    city: { type: "string", minLength: 1, maxLength: 255 },
    locality: { type: "string", maxLength: 255 },
    venue: { type: "string", maxLength: 500 },
    category: {
      type: "string",
      enum: [
        "sports",
        "music",
        "meetup",
        "workshop",
        "party",
        "cultural",
        "tech",
        "networking",
        "community",
        "other",
      ],
    },
    eventDate: { type: "string", format: "date-time" },
    entryFee: { type: "integer", minimum: 0 },
    maxAttendees: { type: "integer", minimum: 1 },
    organizer: { type: "string", maxLength: 255 },
    eventLink: { type: "string", format: "uri", maxLength: 500 },
  },
  required: ["title", "city", "category", "eventDate"],
};

const qp = (name: string, enumVals?: string[]) => {
  const p: Record<string, unknown> = { name, in: "query", schema: { type: "string" } };
  if (enumVals) (p.schema as Record<string, unknown>).enum = enumVals;
  return p;
};

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Flatme API",
    version: "1.0.0",
    description: "Flat sharing & local services platform API",
  },
  servers: [{ url: "/" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "User", description: "User profile & sessions" },
    { name: "Flats", description: "Flat listings" },
    { name: "Flatmates", description: "Flatmate profiles" },
    { name: "Equipment", description: "Equipment listings" },
    { name: "Services", description: "Local services" },
    { name: "Events", description: "Community events" },
    { name: "Search", description: "Global search" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        responses: { 200: { description: "Healthy" }, 503: { description: "Degraded" } },
      },
    },
    "/auth/google": {
      get: {
        tags: ["Auth"],
        summary: "Initiate Google OAuth",
        responses: { 302: { description: "Redirect to Google" } },
      },
    },
    "/auth/google/callback": {
      get: {
        tags: ["Auth"],
        summary: "Google OAuth callback",
        responses: { 200: { description: "Tokens returned" } },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        responses: {
          200: { description: "New tokens" },
          401: errorResponse("Invalid refresh token"),
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout",
        responses: { 200: { description: "Logged out" } },
      },
    },
    "/api/me": {
      get: {
        tags: ["User"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "User profile" }, 401: errorResponse("Unauthorized") },
      },
      patch: {
        tags: ["User"],
        summary: "Update profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", maxLength: 255 },
                  city: { type: "string", maxLength: 255 },
                  photo: { type: "string", format: "uri", maxLength: 500 },
                  gender: { type: "string", enum: ["male", "female", "other"] },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Updated" }, 401: errorResponse("Unauthorized") },
      },
    },
    "/api/me/sessions": {
      get: {
        tags: ["User"],
        summary: "List active sessions",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Sessions list" } },
      },
    },
    "/api/me/sessions/{id}": {
      delete: {
        tags: ["User"],
        summary: "Revoke a session",
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: { 200: { description: "Revoked" }, 404: errorResponse("Not found") },
      },
    },
    ...crudPaths("/api/flats", "Flats", flatSchema, [
      qp("city"),
      qp("minRent"),
      qp("maxRent"),
      qp("flatType", ["1bhk", "2bhk", "3bhk", "4bhk", "studio", "shared", "penthouse"]),
      qp("furnishing", ["furnished", "semi-furnished", "unfurnished"]),
      qp("gender"),
    ]),
    ...crudPaths("/api/equipment", "Equipment", equipmentSchema, [
      qp("city"),
      qp("category", [
        "furniture",
        "electronics",
        "appliances",
        "kitchen",
        "fitness",
        "books",
        "other",
      ]),
      qp("condition", ["new", "like-new", "good", "fair", "poor"]),
      qp("minPrice"),
      qp("maxPrice"),
    ]),
    ...crudPaths("/api/services", "Services", serviceSchema, [
      qp("city"),
      qp("locality"),
      qp("serviceType", [
        "maid",
        "cook",
        "cleaner",
        "laundry",
        "babysitter",
        "electrician",
        "plumber",
        "carpenter",
        "painter",
        "pest-control",
        "movers",
        "other",
      ]),
    ]),
    ...crudPaths("/api/events", "Events", eventSchema, [
      qp("city"),
      qp("category", [
        "sports",
        "music",
        "meetup",
        "workshop",
        "party",
        "cultural",
        "tech",
        "networking",
        "community",
        "other",
      ]),
    ]),
    "/api/flatmates": {
      get: {
        tags: ["Flatmates"],
        summary: "List flatmate profiles",
        parameters: [
          ...paginationParams,
          qp("city"),
          qp("gender"),
          qp("minBudget"),
          qp("maxBudget"),
        ],
        responses: { 200: { description: "Success" } },
      },
      post: {
        tags: ["Flatmates"],
        summary: "Create flatmate profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: flatmateSchema } },
        },
        responses: { 201: { description: "Created" }, 401: errorResponse("Unauthorized") },
      },
      patch: {
        tags: ["Flatmates"],
        summary: "Update own flatmate profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: flatmateSchema } },
        },
        responses: { 200: { description: "Updated" }, 401: errorResponse("Unauthorized") },
      },
      delete: {
        tags: ["Flatmates"],
        summary: "Delete own flatmate profile",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Deleted" }, 401: errorResponse("Unauthorized") },
      },
    },
    "/api/flatmates/{id}": {
      get: {
        tags: ["Flatmates"],
        summary: "Get flatmate profile by ID",
        parameters: [idParam],
        responses: { 200: { description: "Success" }, 404: errorResponse("Not found") },
      },
    },
    "/api/search": {
      get: {
        tags: ["Search"],
        summary: "Global search across all listings",
        parameters: [...paginationParams, qp("q"), qp("city"), qp("type")],
        responses: { 200: { description: "Search results" } },
      },
    },
  },
};
