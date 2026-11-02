const truncateItemLinkText = (text: string): string =>
  text.length > 15 ? `${text.slice(0, 15)}…` : text;

export default truncateItemLinkText;
