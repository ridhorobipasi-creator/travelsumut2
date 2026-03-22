import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Users, Fuel, Gauge, Check } from "lucide-react";
import { useGetVehicles } from "@workspace/api-client-react";
import { formatRupiah } from "@/lib/utils";
import { MOCK_VEHICLES } from "@/lib/mockData";
import { SEO } from "@/components/ui/SEO";
import { useTranslation } from "react-i18next";

export default function Vehicles() {
  const { t } = useTranslation();
  const { data: vehicles } = useGetVehicles();
  const displayVehicles = vehicles && vehicles.length > 0 ? vehicles : MOCK_VEHICLES;

  return (
    <PublicLayout>
      <SEO 
        title={t('vehicles.seo.title')}
        description={t('vehicles.seo.description')}
        keywords={t('vehicles.seo.keywords')}
      />
      <section className="pt-32 pb-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display font-bold mb-6 text-primary"
            >
              {t('vehicles.hero.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground"
            >
              {t('vehicles.hero.desc')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayVehicles.map((vehicle, i) => (
              <motion.div 
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-3xl overflow-hidden shadow-soft border border-border/50 group hover:shadow-soft-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row h-full">
                  <div className="lg:w-2/5 relative overflow-hidden h-64 lg:h-auto">
                    <img 
                      src={vehicle.imageUrl} 
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        {vehicle.type}
                      </span>
                    </div>
                  </div>
                  <div className="lg:w-3/5 p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{vehicle.name}</h3>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{vehicle.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="flex flex-col items-center p-3 rounded-2xl bg-muted/50 border border-border/50">
                          <Users className="w-5 h-5 text-primary mb-1" />
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">{t('vehicles.card.capacity')}</span>
                          <span className="text-sm font-bold text-foreground">{t('vehicles.card.person', { count: vehicle.capacity })}</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-2xl bg-muted/50 border border-border/50">
                          <Fuel className="w-5 h-5 text-primary mb-1" />
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">{t('vehicles.card.fuel')}</span>
                          <span className="text-sm font-bold text-foreground">{t('vehicles.card.fuelType')}</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-2xl bg-muted/50 border border-border/50">
                          <Gauge className="w-5 h-5 text-primary mb-1" />
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">{t('vehicles.card.transmission')}</span>
                          <span className="text-sm font-bold text-foreground">{t('vehicles.card.transType')}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-8">
                        {vehicle.features?.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            <Check className="w-4 h-4 text-secondary shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">{t('vehicles.card.priceLabel')}</p>
                        <p className="text-2xl font-black text-primary">{formatRupiah(vehicle.price)}</p>
                      </div>
                        <a 
                          href={`https://wa.me/628116000789?text=${encodeURIComponent(t('vehicles.card.whatsappMsg', { name: vehicle.name }))}`}
                          target="_blank"
                          className="bg-secondary text-white hover:bg-secondary/90 px-6 py-3 rounded-xl font-bold transition-colors shadow-soft"
                        >
                          {t('vehicles.card.bookNow')}
                        </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
