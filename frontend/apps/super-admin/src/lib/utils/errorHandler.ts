import { AxiosError } from "axios";

export class ErrorHandler {

  static handleApiError(error: unknown, context?: string): never {
    const errorContext = context ? `[${context}]` : "[API]";

    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      console.error(`${errorContext} Axios Error:`, {
        status,
        message,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
      });

      throw error;
    }

    if (error instanceof Error) {
      console.error(`${errorContext} Error:`, error.message);
      throw new Error(`API Error: ${error.message}`);
    }

    console.error(`${errorContext} Unknown Error:`, error);
    throw new Error("An unexpected error occurred");
  }


  static getUserFriendlyMessage(error: unknown): string {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      switch (status) {
        case 401:
          return "Avtorizatsiya xatosi. Iltimos, qayta kiring.";
        case 403:
          return "Sizda bu amalni bajarish uchun ruxsat yo'q.";
        case 404:
          return "So'ralgan ma'lumot topilmadi.";
        case 422:
          return "Kiritilgan ma'lumotlar noto'g'ri.";
        case 500:
          return "Server xatosi. Iltimos, keyinroq urinib ko'ring.";
        default:
          return "Tarmoq xatosi yuz berdi.";
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Kutilmagan xato yuz berdi.";
  }
}


export const handleApiError = (error: unknown, context?: string): never => {
  return ErrorHandler.handleApiError(error, context);
};
