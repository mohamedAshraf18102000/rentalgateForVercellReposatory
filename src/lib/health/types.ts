export const BACKEND_HEALTH_STATUS_UP = "UP" as const;

export type BackendHealthStatus = typeof BACKEND_HEALTH_STATUS_UP | string;

export type BackendHealthResponse = {
  status: BackendHealthStatus;
};

export type BackendHealthCheckResult = {
  isUp: boolean;
  status: BackendHealthStatus | null;
};
