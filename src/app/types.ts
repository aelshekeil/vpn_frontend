interface RegisterResponse {
  message?: string;
  token?: string;
}

const data = await response.json() as RegisterResponse;
