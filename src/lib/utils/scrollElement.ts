export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const offset = elementTop - 76;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }
};
