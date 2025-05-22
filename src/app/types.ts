interface RegisterResponse {
  message?: string;
  token?: string;
}
export {};

const data = await response.json() as RegisterResponse;
