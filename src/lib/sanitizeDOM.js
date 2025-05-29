import DOMPurify from 'isomorphic-dompurify';

export const sanitizeDOM = (html = '', opt = {}) => {
  return DOMPurify.sanitize(html, opt);
}