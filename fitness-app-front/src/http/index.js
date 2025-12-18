import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

let csrfTokenPromise = null;

async function fetchCsrfToken() {
  if (!csrfTokenPromise) {
    csrfTokenPromise = api
      .get("/csrf-token")
      .then((response) => {
        const csrfToken = response.data.csrfToken;
        api.defaults.headers.common["X-CSRF-Token"] = csrfToken;
        return csrfToken;
      })
      .catch((error) => {
        console.error("Error fetching CSRF token:", error);
        csrfTokenPromise = null;
      });
  }
  return csrfTokenPromise;
}

api.interceptors.request.use(
  async (config) => {
    if (
      !api.defaults.headers.common["X-CSRF-Token"] &&
      config.method !== "get"
    ) {
      await fetchCsrfToken();
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

export { api, fetchCsrfToken };
