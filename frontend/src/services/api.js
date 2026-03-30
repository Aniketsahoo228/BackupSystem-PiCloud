const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchFiles(deviceId, pin) {
  const params = new URLSearchParams({ device_id: deviceId, pin });
  return request(`/list?${params.toString()}`);
}

export async function fetchRecovery() {
  return request("/recover");
}

export async function uploadFiles(deviceId, pin, files) {
  const formData = new FormData();
  formData.append("device_id", deviceId);
  formData.append("pin", pin);

  files.forEach((file) => {
    formData.append("files", file);
  });

  return request("/backup", {
    method: "POST",
    body: formData,
  });
}
