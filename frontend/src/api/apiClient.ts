/**
 * 统一 API 客户端
 * 所有 API 请求都通过此客户端进行，确保不使用任何静态数据
 */

const BASE_URL = ''; // 使用 Vite 代理

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * 发起 API 请求
 * @param endpoint API 端点
 * @param options fetch 选项
 * @returns API 响应
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // 尝试从 localStorage 获取 token
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || {
          code: 'HTTP_ERROR',
          message: `HTTP ${response.status}`,
        },
      };
    }

    return result;
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : '网络错误',
      },
    };
  }
}

/**
 * GET 请求
 */
export async function apiGet<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
  const url = params 
    ? `${endpoint}?${new URLSearchParams(params)}`
    : endpoint;
  
  return apiRequest<T>(url, { method: 'GET' });
}

/**
 * POST 请求
 */
export async function apiPost<T>(endpoint: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT 请求
 */
export async function apiPut<T>(endpoint: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE 请求
 */
export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}
