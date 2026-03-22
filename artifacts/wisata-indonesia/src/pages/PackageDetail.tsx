import { useParams, useLocation } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { MOCK_PACKAGES } from "@/lib/mockData";
import { formatRupiah } from "@/lib/utils";
import { MapPin, Calendar, Star, Clock, Users, CheckCircle2, Navigation, MessageCircle, Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { SEO } from "@/components/ui/SEO";
import NotFound from "./not-found";

export default function PackageDetail() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isBooking, setIsBooking] = useState(false);
  
  const pkg = MOCK_PACKAGES.find(p => p.slug === slug || p.id.toString() === slug);
  const { wishlist, add, remove, loading } = useWishlist();
  const isWishlisted = pkg ? wishlist.some((w) => w.packageId === pkg.id) : false;
  const getWishlistId = pkg ? wishlist.find((w) => w.packageId === pkg.id)?.id : undefined;

  if (!pkg) {
    return <NotFound />;
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      toast({
        title: t('packageDetail.toast.title'),
        description: t('packageDetail.toast.desc', { title: pkg.title }),
      });
    }, 1500);
  };

  const whatsappUrl = `https://wa.me/628116000789?text=${encodeURIComponent(`Halo, saya tertarik dengan paket wisata: ${pkg.title}`)}`;

  return (
    <PublicLayout>
      <SEO 
        title={pkg.title} 
        description={pkg.description}
        keywords={t('packageDetail.seo.keywords', { city: pkg.city?.name, title: pkg.title })}
      />
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] flex flex-col justify-end pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={pkg.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200"} 
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-bold uppercase tracking-wider text-white/90">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-secondary" /> {pkg.city?.name || t('packageDetail.hero.cityFallback')}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-secondary" /> {pkg.duration} Hari Tour</span>
              <span className="flex items-center gap-1.5 bg-secondary/80 px-2.5 py-1 rounded-md text-white"><Star className="w-4 h-4" /> {pkg.rating || "4.8"} / 5.0</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">{pkg.title}</h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl border-l-4 border-secondary pl-4">
              {pkg.description}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Info */}
          <div className="flex-1 space-y-12">
            
            {/* Nav Pills (Dummy for now) */}
            <div className="flex gap-4 border-b border-border pb-1 overflow-x-auto no-scrollbar">
              {[t('packageDetail.tabs.info'), t('packageDetail.tabs.itinerary'), t('packageDetail.tabs.facilities'), t('packageDetail.tabs.policy')].map((tab, i) => (
                <button key={tab} className={`px-4 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${i === 0 ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h3 className="font-display font-bold mb-4">{t('packageDetail.about.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('packageDetail.about.desc', { title: pkg.title })}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-10">
                <div className="bg-muted px-4 py-6 rounded-2xl text-center border border-border">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-bold uppercase">Durasi</p>
                  <p className="font-bold text-lg">{pkg.duration} Hari</p>
                </div>
                <div className="bg-muted px-4 py-6 rounded-2xl text-center border border-border">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-bold uppercase">Tipe Tour</p>
                  <p className="font-bold text-lg">Private / Grup</p>
                </div>
                <div className="bg-muted px-4 py-6 rounded-2xl text-center border border-border">
                  <Navigation className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-bold uppercase">Meeting Point</p>
                  <p className="font-bold text-lg">Bandara KNIA</p>
                </div>
                <div className="bg-muted px-4 py-6 rounded-2xl text-center border border-border">
                  <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-bold uppercase">Konfirmasi</p>
                  <p className="font-bold text-lg">Otomatis</p>
                </div>
              </div>

              <h4 className="font-bold text-xl mb-4">{t('packageDetail.facilities.title')}</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none pl-0">
                {t('packageDetail.facilities.list', { returnObjects: true }).map((item: string) => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground p-3 bg-card border border-border rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking Sidebar */}
          <aside className="w-full lg:w-96 shrink-0">
            <div className="bg-card p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5 border border-border sticky top-28">
              <div className="text-center mb-6 pb-6 border-b border-border/50">
                <p className="text-muted-foreground font-medium mb-1">{t('packageDetail.booking.priceLabel')}</p>
                <p className="text-4xl font-display font-black text-primary">{formatRupiah(pkg.price)}</p>
                <p className="text-sm text-muted-foreground mt-2">{t('packageDetail.booking.priceNote')}</p>
              </div>

              <form className="space-y-4" onSubmit={handleBooking}>
                <button
                  type="button"
                  className={`w-full py-3 mb-2 rounded-xl font-bold text-base flex items-center justify-center gap-2 border ${isWishlisted ? "bg-secondary/10 text-secondary border-secondary" : "bg-muted text-foreground border-border hover:bg-secondary/10 hover:text-secondary"} transition-all`}
                  aria-label={isWishlisted ? t('packageDetail.wishlist.remove') : t('packageDetail.wishlist.add')}
                  disabled={loading}
                  onClick={async () => {
                    if (!pkg) return;
                    if (isWishlisted) {
                      await remove(getWishlistId);
                    } else {
                      await add(pkg.id);
                    }
                  }}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-secondary text-secondary" : "text-secondary"}`} />
                  {isWishlisted ? t('packageDetail.wishlist.remove') : t('packageDetail.wishlist.add')}
                </button>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">{t('packageDetail.booking.date')}</label>
                  <input type="date" required className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">{t('packageDetail.booking.participant')}</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                    {[2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{t('packageDetail.booking.person', { count: n })}</option>)}
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isBooking}
                  className="w-full py-4 mt-4 rounded-xl font-bold text-lg bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isBooking ? <LoadingSpinner /> : <><Calendar className="w-5 h-5" /> {t('packageDetail.booking.bookNow')}</>}
                </button>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  className="w-full py-3 mt-2 rounded-xl font-bold text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> {t('packageDetail.booking.whatsapp')}
                </a>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}
