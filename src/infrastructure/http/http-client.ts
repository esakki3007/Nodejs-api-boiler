export interface HttpClient {
  post<TResponse>(
    url: string,
    body: unknown,
  ): Promise<TResponse>;
}
