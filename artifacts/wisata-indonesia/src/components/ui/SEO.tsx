import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
}

export function SEO({ title, description, keywords }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | Wisata Sumut`;
    document.title = fullTitle;

    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      }
    }

    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="description"]'); // Fixed to keywords
      const keywordsEl = document.querySelector('meta[name="keywords"]');
      if (keywordsEl) {
        keywordsEl.setAttribute("content", keywords);
      }
    }
  }, [title, description, keywords]);

  return null;
}
