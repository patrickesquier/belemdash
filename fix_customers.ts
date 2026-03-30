import { prisma } from './server';

async function fixCustomersTotalSpent() {
  console.log('Fetching customers and active sales...');
  const customers = await prisma.customer.findMany();
  const sales = await prisma.sale.findMany({
    where: {
      status: { not: 'cancelled' }
    }
  });

  for (const customer of customers) {
    const customerSales = sales.filter(s => {
      const matchName = s.customerName === customer.name;
      const matchCPF = customer.cpf && s.customerCPF && 
        customer.cpf.replace(/\D/g, '') === s.customerCPF.replace(/\D/g, '');
      return matchName || matchCPF;
    });

    const totalSpent = customerSales.reduce((acc, s) => acc + s.finalValue, 0);

    if (customer.totalSpent !== totalSpent) {
      await prisma.customer.update({
        where: { id: customer.id },
        data: { totalSpent }
      });
      console.log(`Updated ${customer.name}: ${customer.totalSpent} -> ${totalSpent}`);
    }
  }

  console.log('Done recalculating totalSpent for all customers.');
}

fixCustomersTotalSpent()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
