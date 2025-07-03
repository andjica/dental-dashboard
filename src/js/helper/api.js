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
      // Ne dodaj Content-Type, browser će sam dodati multipart/form-data sa boundary
      options.body = body;
    } else {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  return fetch(`http://localhost:8000/api/${url}`, options).then(async (res) => {
    if (res.status === 401) {
      window.dispatchEvent(new Event("tokenExpired"));
      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch ${url}`);
    }

    return res.json();
  });
};


export const get = (url) => API(url, "GET");
export const post = (url, body) => API(url, "POST", body);
export const put = (url, body) => API(url, "PUT", body);
export const remove = (url) => API(url, "DELETE");

export default API;
