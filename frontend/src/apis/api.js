const API_URL = 'http://localhost:5000/api';

export const apiFetch = async (url, option = {}) => {
  const res = await fetch(`${API_URL}${url}`, {
    ...option,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...option.headers,
    },
  });

  const contentType = res.headers.get('content-type');
  const data = contentType?.includes('application/json')
    ? await res.json()
    : null;

  console.log(data);

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};
