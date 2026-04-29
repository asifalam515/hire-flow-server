/**
 * Sanitize HTML content from rich-text editors (e.g., Tiptap)
 * Removes dangerous scripts, event handlers, and disallowed tags
 * @param html Raw HTML string from editor
 * @returns Sanitized HTML string
 */
export declare const sanitizeHTML: (html: string) => string;
/**
 * Validate rich-text content size
 * @param html HTML content
 * @param maxLength Maximum allowed length in characters (default: 5000)
 * @returns true if valid, false otherwise
 */
export declare const validateHTMLLength: (html: string, maxLength?: number) => boolean;
declare const _default: {
    sanitizeHTML: (html: string) => string;
    validateHTMLLength: (html: string, maxLength?: number) => boolean;
};
export default _default;
//# sourceMappingURL=richTextUtils.d.ts.map