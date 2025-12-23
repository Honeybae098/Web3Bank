// Authentication Configuration
export const AUTH_CONFIG = {
  // Session Management
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  SESSION_RENEWAL_THRESHOLD: 30 * 60 * 1000, // 30 minutes before expiry
  AUTO_LOGOUT_WARNING: 5 * 60 * 1000, // 5 minutes before logout

  // Message Templates
  AUTH_MESSAGE_TEMPLATE: 'SmartBank Authentication\n\nPlease sign this message to authenticate your wallet.\n\nNonce: {nonce}\nTimestamp: {timestamp}\nExpires: {expires}',

  // Security Settings
  MIN_PASSWORD_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes

  // Storage Keys
  STORAGE_KEYS: {
    SESSION_TOKEN: 'smartbank_session_token',
    USER_PROFILE: 'smartbank_user_profile',
    AUTH_NONCE: 'smartbank_auth_nonce',
    LAST_ACTIVITY: 'smartbank_last_activity'
  },

  // User Roles
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  },

  // Network Configuration
  SUPPORTED_NETWORKS: {
    MAINNET: 1,
    SEPOLIA: 11155111,
    GOERLI: 5
  },

  // API Endpoints (for future backend integration)
  API_ENDPOINTS: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    PROFILE: '/api/user/profile',
    VALIDATE: '/api/auth/validate'
  },

  // UI Configuration
  UI: {
    TOAST_DURATION: 5000,
    LOADING_TIMEOUT: 30000,
    MODAL_ANIMATION_DURATION: 300
  }
};

// Default user profile template
export const DEFAULT_USER_PROFILE = {
  id: null,
  address: null,
  username: null,
  email: null,
  role: AUTH_CONFIG.USER_ROLES.USER,
  createdAt: null,
  lastLoginAt: null,
  preferences: {
    theme: 'dark',
    notifications: true,
    language: 'en'
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: null
  }
};

// Error messages
export const AUTH_ERRORS = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet first',
  SIGNATURE_REJECTED: 'Signature was rejected by user',
  INVALID_SIGNATURE: 'Invalid signature provided',
  SESSION_EXPIRED: 'Your session has expired',
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action',
  NETWORK_MISMATCH: 'Please switch to the supported network',
  WALLET_LOCKED: 'Wallet is locked or unavailable',
  UNKNOWN_ERROR: 'An unknown error occurred'
};

// Success messages
export const AUTH_SUCCESS = {
  LOGIN_SUCCESS: 'Successfully authenticated',
  LOGOUT_SUCCESS: 'Successfully logged out',
  PROFILE_UPDATED: 'Profile updated successfully',
  REGISTRATION_SUCCESS: 'Registration completed successfully'
};
