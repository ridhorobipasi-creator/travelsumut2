import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Search, Clock } from "lucide-react";
import { useGetBlogPosts } from "@workspace/api-client-react";
import { MOCK_BLOG } from "@/lib/mockData";
import { Link } from "wouter";
import { SEO } from "@/components/ui/SEO";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/lib/utils";

export default function Blog() {
  const { t } = useTranslation();
  const { data: blogPosts } = useGetBlogPosts();
  const displayPosts = blogPosts && blogPosts.length > 0 ? blogPosts : MOCK_BLOG;

  return (
    <PublicLayout>
      <SEO 
        title={t('blog.seo.title')}
        description={t('blog.seo.description')}
        keywords={t('blog.seo.keywords')}
      />
      <section className="pt-32 pb-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display font-bold mb-6 text-primary"
            >
              {t('blog.hero.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground"
            >
              {t('blog.hero.desc')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {displayPosts.map((post, i) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-3xl overflow-hidden shadow-soft border border-border/50 group hover:shadow-soft-lg transition-all"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-2/5 relative overflow-hidden h-64 md:h-auto">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="md:w-3/5 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>5 Menit Baca</span>
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors leading-tight">{post.title}</h2>
                        <p className="text-muted-foreground text-base mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">W</div>
                          <span className="text-sm font-bold text-foreground">Wisata Sumut</span>
                        </div>
                        <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all uppercase tracking-wide text-xs">
                          Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <aside className="space-y-10">
              <div className="bg-card p-8 rounded-3xl shadow-soft border border-border/50">
                <h3 className="text-xl font-bold mb-6 text-foreground">{t('blog.sidebar.searchTitle')}</h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder={t('blog.sidebar.searchPlaceholder')}
                    className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                </div>
              </div>

              <div className="bg-card p-8 rounded-3xl shadow-soft border border-border/50">
                <h3 className="text-xl font-bold mb-6 text-foreground">{t('blog.sidebar.categoryTitle')}</h3>
                <div className="flex flex-wrap gap-2">
                  {t('blog.sidebar.categories', { returnObjects: true }).map((cat: string) => (
                    <button key={cat} className="px-4 py-2 rounded-xl bg-muted/50 border border-border hover:bg-primary hover:text-white hover:border-primary transition-all text-sm font-medium">
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-primary p-8 rounded-3xl shadow-soft-lg text-primary-foreground relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <h3 className="text-xl font-bold mb-4 relative z-10">{t('blog.sidebar.newsletterTitle')}</h3>
                <p className="text-primary-foreground/80 text-sm mb-6 relative z-10">{t('blog.sidebar.newsletterDesc')}</p>
                <div className="space-y-3 relative z-10">
                  <input 
                    type="email" 
                    placeholder={t('blog.sidebar.newsletterPlaceholder')}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all text-sm"
                  />
                  <button className="w-full bg-white text-primary hover:bg-white/90 py-3 rounded-xl font-bold transition-all shadow-soft text-sm">
                    {t('blog.sidebar.newsletterButton')}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
