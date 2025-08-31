"use client";

import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import ProductSideMenu from "@/components/ProductSideMenu";
import QuantityButtons from "@/components/QuantityButtons";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const query = `*[_type=="address"] | order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr: Address) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]); // Optional: select first address if no default
      }
    } catch (error) {
      console.log("Addresses fetching error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleResetCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your cart?"
    );
    if (confirmed) {
      resetCart();
      toast.success("Cart reset successfully!");
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please sign in to checkout");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (groupedItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setLoading(true);
      const metadata: Metadata = {
        userId: user.uid,
        address: selectedAddress,
        items: groupedItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      };

      const session = await createCheckoutSession(metadata);
      if (session?.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <NoAccess details="Log in to view your cart items and checkout. Don't miss out on your favorite products!" />;
  }

  if (groupedItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-10">
        <Title title="Shopping Cart" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {groupedItems.map((item) => (
              <Card key={item.product._id} className="p-4">
                <CardContent className="flex items-center gap-4 p-0">
                  <div className="relative w-20 h-20">
                    <Image
                      src={urlFor(item.product.images?.[0]).url()}
                      alt={item.product.title || "Product"}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.product.categories?.join(", ")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <PriceFormatter price={item.product.price || 0} />
                      {item.product.discount && (
                        <span className="text-sm text-green-600">
                          {item.product.discount}% off
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <QuantityButtons
                      productId={item.product._id}
                      quantity={item.quantity}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCartProduct(item.product._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={handleResetCart}
                className="text-red-600 hover:text-red-700"
              >
                Reset Cart
              </Button>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <PriceFormatter price={getSubTotalPrice()} />
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <PriceFormatter price={getTotalPrice()} />
                </div>
                <Separator />
                
                {/* Address Selection */}
                <div className="space-y-2">
                  <Label>Delivery Address</Label>
                  {addresses && addresses.length > 0 ? (
                    <RadioGroup
                      value={selectedAddress?._id || ""}
                      onValueChange={(value) => {
                        const address = addresses.find(addr => addr._id === value);
                        setSelectedAddress(address || null);
                      }}
                    >
                      {addresses.map((address) => (
                        <div key={address._id} className="flex items-center space-x-2">
                          <RadioGroupItem value={address._id} id={address._id} />
                          <Label htmlFor={address._id} className="text-sm">
                            {address.street}, {address.city}, {address.state} {address.zipCode}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No addresses available. Please add an address in your profile.
                    </p>
                  )}
                </div>
                
                <Button
                  onClick={handleCheckout}
                  disabled={loading || !selectedAddress || groupedItems.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
