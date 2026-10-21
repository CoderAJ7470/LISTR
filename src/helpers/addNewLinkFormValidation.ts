export const MAX_LINKS_PER_ITEM = 4;

export const validateLinkURL = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url.trim());
    return parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};
