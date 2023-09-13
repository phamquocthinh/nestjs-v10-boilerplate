declare namespace NodeJS {
  interface IProcessEnv {
    BASE_PATH?: string;
    CLUSTERING: string;
    LOG_LEVEL?: string;
    NODE_ENV: string;
    PORT: string;
  }
}
