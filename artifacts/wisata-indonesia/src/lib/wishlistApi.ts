// Wishlist API — userId sementara hardcoded ke 1 sampai auth diimplementasi
const TEMP_USER_ID = 1;

export async function fetchWishlist() {
  const res = await fetch(`/api/wishlist?userId=${TEMP_USER_ID}`);
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  return res.json();
}

export async function addToWishlist(packageId: number) {
  const res = await fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: TEMP_USER_ID, packageId }),
  });
  if (res.status === 409) throw new Error("Already in wishlist");
  if (!res.ok) throw new Error("Failed to add to wishlist");
  return res.json();
}

export async function removeFromWishlist(id: number) {
  const res = await fetch(`/api/wishlist/${id}?userId=${TEMP_USER_ID}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 404) throw new Error("Failed to remove from wishlist");
}
