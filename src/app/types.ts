async function fetchRegisterData(): Promise<RegisterResponse> {
  const response = await fetch("/api/register");
  const data = await response.json() as RegisterResponse;
  return data;
}
