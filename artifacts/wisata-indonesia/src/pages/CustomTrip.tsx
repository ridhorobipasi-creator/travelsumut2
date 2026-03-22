import { PublicLayout } from "@/components/layout/PublicLayout";
import { Compass, Calendar, MapPin, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SEO } from "@/components/ui/SEO";
import { useCreateCustomTrip } from "@workspace/api-client-react";

const formSchema = z.object({
  customerName: z.string().min(2, "Nama minimal 2 karakter"),
  customerPhone: z.string().min(8, "Nomor tidak valid"),
  customerEmail: z.string().email("Email tidak valid"),
  destination: z.string().min(2, "Isi destinasi"),
  startDate: z.string().min(1, "Pilih tanggal"),
  participants: z.coerce.number().min(1, "Minimal 1 peserta"),
  budget: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  requirements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function CustomTrip() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const createTrip = useCreateCustomTrip();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createTrip.mutateAsync({
        data: {
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone || null,
          destination: data.destination,
          startDate: new Date(data.startDate).toISOString(),
          endDate: null,
          participants: data.participants,
          budget: data.budget ?? null,
          requirements: data.requirements?.trim() || null,
        },
      });
      toast({ title: t("customTrip.toast.title"), description: t("customTrip.toast.desc") });
      reset();
    } catch {
      toast({
        title: "Gagal mengirim",
        description: "Periksa koneksi atau coba lagi nanti.",
        variant: "destructive",
      });
    }
  };

  return (
    <PublicLayout>
      <SEO 
        title={t('customTrip.seo.title')}
        description={t('customTrip.seo.description')}
        keywords={t('customTrip.seo.keywords')}
      />
      <div className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-background">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary font-bold text-sm mb-6 border border-secondary/30">
                <Compass className="w-4 h-4" /> {t('customTrip.hero.badge')}
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight mb-6">
                {t('customTrip.hero.title')}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t('customTrip.hero.desc')}
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: t('customTrip.features.0.title'), desc: t('customTrip.features.0.desc') },
                  { icon: Calendar, title: t('customTrip.features.1.title'), desc: t('customTrip.features.1.desc') },
                  { icon: Wallet, title: t('customTrip.features.2.title'), desc: t('customTrip.features.2.desc') }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card p-8 rounded-3xl shadow-xl shadow-black/5 border border-border">
              <h3 className="text-2xl font-bold mb-6">Form Pengajuan Custom Trip</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Nama Lengkap *</label>
                    <input {...register("customerName")} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Cth: Budi Santoso" />
                    {errors.customerName && <p className="text-destructive text-xs mt-1">{errors.customerName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">No. WhatsApp *</label>
                    <input {...register("customerPhone")} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Cth: 08123456789" />
                    {errors.customerPhone && <p className="text-destructive text-xs mt-1">{errors.customerPhone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email *</label>
                  <input {...register("customerEmail")} type="email" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="budi@email.com" />
                  {errors.customerEmail && <p className="text-destructive text-xs mt-1">{errors.customerEmail.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Destinasi Tujuan *</label>
                  <input {...register("destination")} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Cth: Sumba & Labuan Bajo" />
                  {errors.destination && <p className="text-destructive text-xs mt-1">{errors.destination.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Tanggal Mulai *</label>
                    <input {...register("startDate")} type="date" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                    {errors.startDate && <p className="text-destructive text-xs mt-1">{errors.startDate.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Jumlah Peserta *</label>
                    <input {...register("participants")} type="number" min="1" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="1" />
                    {errors.participants && <p className="text-destructive text-xs mt-1">{errors.participants.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Estimasi Budget per Orang (Opsional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Rp</span>
                    <input {...register("budget")} type="number" className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="5000000" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Kebutuhan Khusus / Catatan</label>
                  <textarea {...register("requirements")} rows={4} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none" placeholder="Cth: Butuh fotografer, penginapan villa, dll..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={createTrip.isPending}
                  className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {createTrip.isPending ? "Mengirim..." : "Kirim Permintaan"}
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default CustomTrip;
