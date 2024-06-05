export const getCSRFToken = () => {
  if (typeof document !== 'undefined') {
    const csrfMetaTag = document.querySelector('meta[name="csrf-token"]');
    if (csrfMetaTag) {
      return csrfMetaTag.getAttribute('content');
    }
  }
  return null;
};
