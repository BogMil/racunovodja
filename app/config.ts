export const BASE_URL: string =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? // dev
      'http://127.0.0.1:8000'
    : // production code
      'http://racunovodja.bogmilko.rs';
