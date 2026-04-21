export const ErrorCodes = {
  // Auth errors (AUTH_XXX)
  AUTH: {
    INVALID_CREDENTIALS: 'AUTH_001',
    TOKEN_EXPIRED: 'AUTH_002',
    TOKEN_INVALID: 'AUTH_003',
    TOKEN_MISSING: 'AUTH_004',
    REFRESH_TOKEN_INVALID: 'AUTH_005',
    REFRESH_TOKEN_EXPIRED: 'AUTH_006',
    SESSION_EXPIRED: 'AUTH_007',
    UNAUTHORIZED: 'AUTH_008',
    FORBIDDEN: 'AUTH_009',
  },

  // User errors (USER_XXX)
  USER: {
    NOT_FOUND: 'USER_001',
    DUPLICATE_USERNAME: 'USER_002',
    CREATE_FAILED: 'USER_003',
    UPDATE_FAILED: 'USER_004',
    DELETE_FAILED: 'USER_005',
    INVALID_DATA: 'USER_006',
    HAS_TASKS: 'USER_007',
  },

  // Task errors (TASK_XXX)
  TASK: {
    NOT_FOUND: 'TASK_001',
    CREATE_FAILED: 'TASK_002',
    UPDATE_FAILED: 'TASK_003',
    DELETE_FAILED: 'TASK_004',
    INVALID_DATA: 'TASK_005',
    USER_NOT_FOUND: 'TASK_006',
  },

  // Validation errors (VAL_XXX)
  VALIDATION: {
    INVALID_INPUT: 'VAL_001',
    MISSING_FIELD: 'VAL_002',
    INVALID_FORMAT: 'VAL_003',
  },

  // Database errors (DB_XXX)
  DATABASE: {
    CONNECTION_ERROR: 'DB_001',
    QUERY_ERROR: 'DB_002',
    TIMEOUT: 'DB_003',
  },

  // Server errors (SRV_XXX)
  SERVER: {
    INTERNAL_ERROR: 'SRV_001',
    UNKNOWN_ERROR: 'SRV_002',
  },
} as const;

export type ErrorCode = 
  | typeof ErrorCodes.AUTH[keyof typeof ErrorCodes.AUTH]
  | typeof ErrorCodes.USER[keyof typeof ErrorCodes.USER]
  | typeof ErrorCodes.TASK[keyof typeof ErrorCodes.TASK]
  | typeof ErrorCodes.VALIDATION[keyof typeof ErrorCodes.VALIDATION]
  | typeof ErrorCodes.DATABASE[keyof typeof ErrorCodes.DATABASE]
  | typeof ErrorCodes.SERVER[keyof typeof ErrorCodes.SERVER];
