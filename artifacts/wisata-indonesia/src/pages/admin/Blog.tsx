import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useGetBlogPosts,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
  getGetBlogPostsQueryKey,
  type BlogPost,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plus, Edit, Trash2, Search, FileText, Calendar, User, Eye, Image as ImageIcon } from "lucide-react";
import { formatDate, slugify } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { MOCK_BLOG } from "@/lib/mockData";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminBlog() {
  const queryClient = useQueryClient();
  const { data: fetchedPosts, isLoading, error } = useGetBlogPosts();
  const createMut = useCreateBlogPost();
  const updateMut = useUpdateBlogPost();
  const deleteMut = useDeleteBlogPost();
  const [localPosts, setLocalPosts] = useState(MOCK_BLOG);
  const { toast } = useToast();

  const isMutating = createMut.isPending || updateMut.isPending || deleteMut.isPending;

  useEffect(() => {
    if (error) {
      toast({
        title: "Koneksi API Gagal",
        description: "Menampilkan artikel simulasi karena server database belum terhubung.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | (typeof MOCK_BLOG)[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    category: "Tips Perjalanan",
    author: "Wisata Sumut",
    publishedDate: new Date().toISOString().split("T")[0],
    isPublished: true,
  });

  const posts = error || fetchedPosts === undefined ? localPosts : fetchedPosts;
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;

    if (error) {
      setLocalPosts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Berhasil dihapus", description: "Artikel dihapus (mode simulasi)." });
      return;
    }

    try {
      await deleteMut.mutateAsync({ id });
      await queryClient.invalidateQueries({ queryKey: getGetBlogPostsQueryKey() });
      toast({ title: "Berhasil dihapus", description: "Artikel dihapus dari server." });
    } catch {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    }
  };

  const openAddForm = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      category: "Tips Perjalanan",
      author: "Wisata Sumut",
      publishedDate: new Date().toISOString().split("T")[0],
      isPublished: true,
    });
    setIsFormOpen(true);
  };

  const openEditForm = (post: BlogPost | (typeof MOCK_BLOG)[number]) => {
    setEditingPost(post);
    const publishedAt =
      "publishedAt" in post && post.publishedAt
        ? new Date(post.publishedAt).toISOString().split("T")[0]
        : "date" in post && post.date
          ? String(post.date).slice(0, 10)
          : new Date().toISOString().split("T")[0];
    setFormData({
      title: post.title,
      excerpt: post.excerpt || "",
      content: "content" in post && post.content ? post.content : "",
      imageUrl: post.imageUrl || "",
      category: ("category" in post && post.category) || "Tips Perjalanan",
      author: "authorName" in post && post.authorName ? post.authorName : "Wisata Sumut",
      publishedDate: publishedAt,
      isPublished: "isPublished" in post ? post.isPublished : true,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const slugBase =
      editingPost && "slug" in editingPost && editingPost.slug
        ? editingPost.slug
        : slugify(formData.title) || "artikel";

    if (error) {
      if (editingPost) {
        setLocalPosts((prev) =>
          prev.map((p) =>
            p.id === editingPost.id
              ? {
                  ...p,
                  title: formData.title,
                  excerpt: formData.excerpt,
                  imageUrl: formData.imageUrl,
                  date: formData.publishedDate,
                  slug: slugBase,
                }
              : p,
          ),
        );
      } else {
        const newPost = {
          id: Math.max(...localPosts.map((p) => p.id), 0) + 1,
          title: formData.title,
          excerpt: formData.excerpt,
          imageUrl: formData.imageUrl,
          date: formData.publishedDate,
          slug: slugBase,
        };
        setLocalPosts((prev) => [newPost, ...prev]);
      }
      toast({ title: "Tersimpan (mode simulasi)" });
      setIsFormOpen(false);
      return;
    }

    const payload = {
      title: formData.title,
      slug: slugBase,
      excerpt: formData.excerpt || null,
      content: formData.content || "<p></p>",
      imageUrl: formData.imageUrl || null,
      category: formData.category || null,
      tags: [] as string[],
      authorName: formData.author,
      isPublished: formData.isPublished,
    };

    try {
      if (editingPost && "createdAt" in editingPost) {
        const ex = editingPost as BlogPost;
        await updateMut.mutateAsync({
          id: ex.id,
          data: {
            ...payload,
            slug: ex.slug,
          },
        });
      } else {
        await createMut.mutateAsync({ data: payload });
      }
      await queryClient.invalidateQueries({ queryKey: getGetBlogPostsQueryKey() });
      toast({ title: "Berhasil disimpan" });
      setIsFormOpen(false);
    } catch {
      toast({ title: "Gagal menyimpan (slug unik?)", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Kelola Blog</h1>
          <p className="text-muted-foreground mt-1">Tulis dan kelola artikel tips perjalanan & berita wisata.</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tulis Artikel
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm bg-muted/10">
                  <th className="py-4 px-8 font-semibold w-24">ID</th>
                  <th className="py-4 px-8 font-semibold">Info Artikel</th>
                  <th className="py-4 px-8 font-semibold">Penulis & Tanggal</th>
                  <th className="py-4 px-8 font-semibold">Status</th>
                  <th className="py-4 px-8 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredPosts?.map((post) => {
                  const author =
                    "authorName" in post && post.authorName ? post.authorName : "Wisata Sumut";
                  const when =
                    "publishedAt" in post && post.publishedAt
                      ? post.publishedAt
                      : "date" in post
                        ? String(post.date)
                        : "createdAt" in post
                          ? post.createdAt
                          : "";
                  const pub = "isPublished" in post ? post.isPublished : true;
                  return (
                    <tr key={post.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
                      <td className="py-4 px-8 text-muted-foreground font-mono">#{post.id.toString().padStart(4, "0")}</td>
                      <td className="py-4 px-8">
                        <div className="flex items-center gap-4 max-w-md">
                          <img
                            src={
                              post.imageUrl ||
                              "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=150"
                            }
                            alt=""
                            className="w-16 h-12 rounded-lg object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-base mb-0.5 line-clamp-1">{post.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-8">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wide">
                            <User className="w-3.5 h-3.5 text-primary" /> {author}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" /> {formatDate(when)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-8">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${pub ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}
                        >
                          {pub ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-4 px-8">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditForm(post)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filteredPosts?.length && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Tidak ada artikel yang cocok dengan pencarian Anda.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">
              {editingPost ? "Edit Artikel" : "Tulis Artikel Baru"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                  placeholder="Cth: 7 Tips Menjelajahi Danau Toba"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Tanggal Terbit</label>
                  <input
                    type="date"
                    required
                    value={formData.publishedDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, publishedDate: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">URL Gambar Sampul</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm pr-12"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <ImageIcon className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Kategori</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Penulis</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Ringkasan (Excerpt)</label>
                <textarea
                  rows={3}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm resize-none"
                  placeholder="Tulis ringkasan singkat artikel..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Konten (HTML sederhana)</label>
                <textarea
                  rows={10}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary outline-none transition-all text-sm resize-none font-mono text-xs"
                  placeholder="<p>Isi artikel...</p>"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  className="w-4 h-4 rounded border-border text-primary"
                />
                <span className="text-sm font-medium">Terbitkan (published)</span>
              </label>
            </div>

            <DialogFooter className="pt-6 border-t border-border">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 bg-muted text-muted-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isMutating}
                className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-60"
              >
                {isMutating ? "Menyimpan…" : editingPost ? "Simpan Perubahan" : "Terbitkan Artikel"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
