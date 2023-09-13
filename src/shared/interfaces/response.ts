export interface IHttpSuccessResponse<T> {
  readonly data: T;
}

export interface IFailResponse {
  readonly message: string;
  readonly code: number;
}

export interface IHttpFailResponse {
  readonly error: IFailResponse;
}
