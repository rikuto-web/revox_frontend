import axios, { AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

/**
 * API通信を管理するためのクライアントクラスです。
 * 共通のヘッダー設定、認証トークンの自動付与、およびエラーハンドリングを行います。
 */
class ApiClient {
  private client: AxiosInstance;

  /**
   * ApiClientの新しいインスタンスを生成します。
   */
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Axiosインターセプターを設定します。
   * リクエスト送信前とレスポンス受信後の共通処理を定義します。
   */
  private setupInterceptors() {
    // リクエストインターセプター: 認証トークンをヘッダーに自動付与
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // レスポンスインターセプター: 共通エラーハンドリング
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const { status } = error.response || {};

        switch (status) {
          case 401:
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            window.location.href = '/login';
            toast.error('認証が必要です。再度ログインしてください。');
            break;
          case 403:
            toast.error('アクセス権限がありません。');
            break;
          case 404:
            toast.error('リクエストされたリソースが見つかりません。');
            break;
          case 500:
            toast.error('サーバーエラーが発生しました。');
            break;
          default:
            const errorMessage = error.response?.data?.message || 'エラーが発生しました。';
            toast.error(errorMessage);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * HTTP GETリクエストを送信します。
   * @template T レスポンスデータの型
   * @param url リクエスト先のURL
   * @returns サーバーからのレスポンスデータを解決するPromise
   */
  public get<T>(url: string): Promise<T> {
    return this.client.get(url).then((response) => response.data);
  }

  /**
   * HTTP POSTリクエストを送信します。
   * @template T レスポンスデータの型
   * @param url リクエスト先のURL
   * @param data 送信するデータ (省略可能)
   * @returns サーバーからのレスポンスデータを解決するPromise
   */
  public post<T>(url: string, data?: any): Promise<T> {
    return this.client.post(url, data).then((response) => response.data);
  }

  /**
   * HTTP PUTリクエストを送信します。
   * @template T レスポンスデータの型
   * @param url リクエスト先のURL
   * @param data 送信するデータ (省略可能)
   * @returns サーバーからのレスポンスデータを解決するPromise
   */
  public put<T>(url: string, data?: any): Promise<T> {
    return this.client.put(url, data).then((response) => response.data);
  }

  /**
   * HTTP PATCHリクエストを送信します。
   * @template T レスポンスデータの型
   * @param url リクエスト先のURL
   * @param data 送信するデータ (省略可能)
   * @returns サーバーからのレスポンスデータを解決するPromise
   */
  public patch<T>(url: string, data?: any): Promise<T> {
    return this.client.patch(url, data).then((response) => response.data);
  }

  /**
   * HTTP DELETEリクエストを送信します。
   * @template T レスポンスデータの型
   * @param url リクエスト先のURL
   * @returns サーバーからのレスポンスデータを解決するPromise
   */
  public delete<T>(url: string): Promise<T> {
    return this.client.delete(url).then((response) => response.data);
  }
}

export const apiClient = new ApiClient();