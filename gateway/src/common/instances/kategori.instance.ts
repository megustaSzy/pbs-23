import { HttpException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

// buat variabel api endpoint kategori
export const kategoriApi = axios.create({
  baseURL: 'http://localhost:3001/api/kategori',
  timeout: 1000,
});

// buat interceptor
kategoriApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message;
    const status = error.response?.status;

    if (message && status) {
      throw new HttpException(message, status);
    }

    throw new HttpException('Internal Error', 500);
  },
);
