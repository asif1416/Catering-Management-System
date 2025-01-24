"use client";

import { useState, useEffect } from "react";
import Image, { type StaticImageData } from "next/image";
import { menuCardImages } from "@/components/imageSources";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Trash2, MapPin, Minus, Plus } from "lucide-react";
import api from "@/api/api";
import toast from "react-hot-toast";

export default function CartPage() {
  const menuImage = menuCardImages[0] || {
    src: "/placeholder.svg",
    alt: "Placeholder Image",
  };
  const router = useRouter();
  const { isLoggedIn, checkAuth } = useAuthStore();
  const {
    items,
    selectedItems,
    setItems,
    removeFromCart,
    updateQuantity,
    toggleItemSelection,
    toggleAllSelection,
  } = useCartStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeCart = async () => {
      setLoading(true);
      const isAuth = await checkAuth();
      console.log("Is Authenticated:", isAuth);
      if (isAuth) {
        try {
          const response = await api.get("/cart");
          const cartItems = response.data.cart?.items || [];

          const formattedItems = cartItems.map((item: any) => ({
            id: item.id,
            menuId: item.menu.id,
            name: item.menu.name,
            price: item.menu.price,
            quantity: item.quantity,
            image: item.menu.image || "/placeholder.svg",
          }));

          setItems(formattedItems); 
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          toast.error("Failed to load cart items");
        }
      } 
      setLoading(false);
    };

    initializeCart();
  }, [checkAuth, setItems, router]);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await api.patch(`/cart/${itemId}`, { quantity: newQuantity });
      updateQuantity(itemId, newQuantity);
      toast.success("Cart updated successfully");
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update cart");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await api.delete(`/cart/${itemId}`);
      removeFromCart(itemId);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        Array.from(selectedItems).map((itemId) => api.delete(`/cart/${itemId}`))
      );
      Array.from(selectedItems).forEach((itemId) => removeFromCart(itemId));
      toast.success("Selected items removed from cart");
    } catch (error) {
      console.error("Failed to remove items:", error);
      toast.error("Failed to remove items from cart");
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  if (!isLoggedIn && !loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
              <p className="text-center mb-4">
                Please log in to view your cart.
              </p>
              <Button
                className="w-full"
                onClick={() => router.push("/auth/signin")}
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedItems.size === items.length && items.length > 0
                  }
                  onCheckedChange={(checked) =>
                    toggleAllSelection(checked as boolean)
                  }
                  id="select-all"
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  SELECT ALL ({items.length} ITEM(S))
                </label>
              </div>
              {selectedItems.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  DELETE
                </Button>
              )}
            </div>

            {items.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center mb-4">Your cart is empty.</p>
                  <Button
                    className="w-full"
                    onClick={() => router.push("/menu")}
                  >
                    Browse Menu
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="mt-4 flex gap-4">
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={() => toggleItemSelection(item.id)}
                        />
                        <Image
                          src={
                            (menuImage.src as string | StaticImageData) ||
                            "/placeholder.svg"
                          }
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                              Price: tk{item.price}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-1/3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-4 w-4" />
                  <h2 className="font-medium">Location</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Feni Sadar, Feni,Chattogram
                </p>
                <h2 className="font-medium mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping Fee</span>
                    <span>₹{shippingFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full"
                    disabled={selectedItems.size === 0}
                    onClick={() => router.push("/checkout")}
                  >
                    PROCEED TO CHECKOUT ({selectedItems.size})
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
