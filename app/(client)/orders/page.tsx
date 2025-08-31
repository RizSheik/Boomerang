"use client";
import Container from "@/components/Container";
import OrdersComponent from "@/components/OrdersComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileX } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import NoAccess from "@/components/NoAccess";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Fetch orders when user is authenticated
      const fetchOrders = async () => {
        try {
          const res = await fetch(`/api/orders/list?uid=${user.uid}`, {
            cache: "no-store",
          });
          const json = await res.json();
          setOrders(json?.orders ?? []);
        } catch (error) {
          console.error("Error fetching orders:", error);
          setOrders([]);
        }
      };
      
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  if (!user) {
    return <NoAccess details="Log in to view your orders." />;
  }

  return (
    <div>
      <Container className="py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button asChild>
                <Link href="/shop">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Order #{order.orderNumber}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OrdersComponent order={order} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;
