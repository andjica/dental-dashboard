export const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("storage")) {
      return new URL(path, "http://164.92.209.125:8000/").toString();
    }
    return new URL(`storage/${path}`, "http://164.92.209.125:8000/").toString();
    // return `http://164.92.209.125:8000/storage/${path}`;
  };