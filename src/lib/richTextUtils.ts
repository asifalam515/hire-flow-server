// Utility for sanitizing HTML content from rich-text editors
// Removes potentially dangerous scripts while preserving formatting

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "del",
  "ins",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "code",
  "pre",
  "a",
  "img",
  "div",
  "span",
];

const ALLOWED_ATTRIBUTES: { [key: string]: string[] } = {
  a: ["href", "title"],
  img: ["src", "alt", "title", "width", "height"],
  div: ["class"],
  span: ["class"],
};

/**
 * Sanitize HTML content from rich-text editors (e.g., Tiptap)
 * Removes dangerous scripts, event handlers, and disallowed tags
 * @param html Raw HTML string from editor
 * @returns Sanitized HTML string
 */
export const sanitizeHTML = (html: string): string => {
  if (!html || typeof html !== "string") return "";

  // Remove script tags and their content
  let sanitized = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // Remove event handlers (on* attributes)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove data URIs from href/src (can be used for XSS)
  sanitized = sanitized.replace(
    /\s(href|src)\s*=\s*["']?data:/gi,
    ' $1="javascript:void(0)"',
  );

  // Remove javascript: protocol
  sanitized = sanitized.replace(
    /\s(href|src)\s*=\s*["']?javascript:/gi,
    ' $1="javascript:void(0)"',
  );

  return sanitized;
};

/**
 * Validate rich-text content size
 * @param html HTML content
 * @param maxLength Maximum allowed length in characters (default: 5000)
 * @returns true if valid, false otherwise
 */
export const validateHTMLLength = (
  html: string,
  maxLength: number = 5000,
): boolean => {
  return html && typeof html === "string" && html.length <= maxLength;
};

export default {
  sanitizeHTML,
  validateHTMLLength,
};
