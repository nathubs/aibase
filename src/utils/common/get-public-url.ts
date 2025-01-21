export const getPublicUrl = (url = "") => {
  return `${window.location.origin}${window.location.pathname}${url}`;
};
