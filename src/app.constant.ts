export const enum ExceptionsMessage {
  NOT_FOUND_USER = 'User not found',
  STATUS_BLOCKED = 'Your account has been locked',
  FORBIDDEN = 'Forbidden',
  BAD_REQUEST = 'Bad request',
  ALREADY_EXISTS = 'user exists',
  NOT_FOUND_REVIEW = 'Review not found',
}

export enum IsBlockedStatus {
  BLOCKED_STATUS = 'blocked',
  ACTIVE_STATUS = 'active',
}

export enum GoogleLogin {
  GOOGLE_CLIENT_ID = '58278291806-gk1kr5l925plgihas1917prajuoed9da.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET = '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',
}

export enum GitHubLogin {
  GITHUB_CLIENT_ID = 'cc2787612add3a5f6a34',
  GITHUB_CLIENT_SECRET = 'fdb4b85db4c7783de34564b12367b92cd10c1e56',
}

export const CLIENT_URL = 'https://app-review-d36e65.netlify.app/home';
