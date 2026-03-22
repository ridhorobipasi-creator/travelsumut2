import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Camera, MapPin, ZoomIn } from "lucide-react";
import { useGetGallery } from "@workspace/api-client-react";
import { MOCK_GALLERY } from "@/lib/mockData";
import { SEO } from "@/components/ui/SEO";
import { useTranslation } from "react-i18next";

export default function Gallery() {
  const { t } = useTranslation();
  const { data: galleryItems } = useGetGallery();
  const displayGallery = galleryItems && galleryItems.length > 0 ? galleryItems : MOCK_GALLERY;

  return (
    <PublicLayout>
      <SEO 
        title={t('gallery.seo.title')}
        description={t('gallery.seo.description')}
        keywords={t('gallery.seo.keywords')}
      />
      <section className="pt-32 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display font-bold mb-6 text-primary"
            >
              {t('gallery.hero.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground"
            >
              {t('gallery.hero.desc')}
            </motion.p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {displayGallery.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative group rounded-3xl overflow-hidden shadow-soft cursor-pointer bg-muted"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-2 text-white/80 font-bold text-xs uppercase tracking-wider mb-2">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span>Sumatera Utara</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">{item.title}</h3>
                  <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:bg-white hover:text-primary transition-all">
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <div className="inline-flex flex-col items-center gap-4 p-12 rounded-[40px] bg-primary/5 border border-primary/10">
              <Camera className="w-12 h-12 text-primary mb-2" />
              <h3 className="text-2xl font-bold text-foreground">{t('gallery.cta.title')}</h3>
              <p className="text-muted-foreground max-w-md">{t('gallery.cta.desc')}</p>
              <a 
                href="https://instagram.com/wisatasumut" 
                target="_blank"
                className="mt-4 bg-primary text-white hover:bg-primary/90 px-8 py-4 rounded-full font-bold transition-all shadow-soft"
              >
                {t('gallery.cta.button')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
