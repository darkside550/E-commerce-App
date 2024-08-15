import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import React from "react";

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInPaisa: true },
    _count: true,
  });

  return {
    amount: (data._sum.pricePaidInPaisa || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({ _sum: { pricePaidInPaisa: true } }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0 ? 0 : (orderData._sum.pricePaidInPaisa || 0) / userCount / 100, // TODO: CONVERT IN RS
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return {
    activeCount,
    inactiveCount,
  };
}

const DashboardCard = ({ title, subtitle, body }: DashboardCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = async () => {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <DashboardCard
        title='Sales'
        subtitle={`${formatNumber(salesData.numberOfSales)} orders `}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title='Customers'
        subtitle={`${formatCurrency(userData.averageValuePerUser)} Average Value `}
        body={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title='Active Products'
        subtitle={`${formatNumber(productData.inactiveCount)} Inactive `}
        body={formatNumber(productData.activeCount)}
      />
    </div>
  );
};

export default AdminDashboard;
