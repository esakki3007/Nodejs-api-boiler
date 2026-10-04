import { request } from 'undici';
import { HttpClient } from './http-client';

export class UndiciHttpClient implements HttpClient {
  constructor(private readonly baseUrl: string) {}

  async post<TResponse>(
    url: string,
    body: unknown,
  ): Promise<TResponse> {
    const response = await request(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(`NetReveal returned HTTP ${response.statusCode}`);
    }

    return response.body.json() as Promise<TResponse>;
  }
}
