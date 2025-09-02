const API = (url, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    if (body instanceof FormData) {
      options.body = body;
    } else {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  return fetch(`http://164.92.209.125:8000/api/${url}`, options).then(
    async (res) => {
      if (res.status === 401) {
        window.dispatchEvent(new Event("tokenExpired"));
        throw new Error("Unauthorized");
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err.message || res.statusText || `Failed to fetch ${url}`
        );
      }

      if (res.status === 204 || res.status === 205) {
        return null;
      }

      try {
        return await res.json();
      } catch (err) {
        console.warn("Response is not JSON:", err);
        return null;
      }
    }
  );
};

export const get = (url) => API(url, "GET");
export const post = (url, body) => API(url, "POST", body);
export const put = (url, body) => API(url, "PUT", body);
export const remove = (url) => API(url, "DELETE");

export default API;
