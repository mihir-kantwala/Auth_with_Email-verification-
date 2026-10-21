import { apiFetch } from './api';

export const registerApi = async (registerForm) => {
  return await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(registerForm),
  });
};
