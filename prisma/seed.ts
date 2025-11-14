import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user');

  const salesDept = await prisma.department.create({
    data: {
      name: 'Sales Department A',
    },
  });

  const marketingDept = await prisma.department.create({
    data: {
      name: 'Sales Department B',
    },
  });

  console.log('Created departments');

  const gm1 = await prisma.user.create({
    data: {
      email: 'gm1@example.com',
      name: 'General Manager 1',
      password: hashedPassword,
      role: 'GM',
      departmentId: salesDept.id,
    },
  });

  await prisma.department.update({
    where: { id: salesDept.id },
    data: { gmId: gm1.id },
  });

  const gm2 = await prisma.user.create({
    data: {
      email: 'gm2@example.com',
      name: 'General Manager 2',
      password: hashedPassword,
      role: 'GM',
      departmentId: marketingDept.id,
    },
  });

  await prisma.department.update({
    where: { id: marketingDept.id },
    data: { gmId: gm2.id },
  });

  console.log('Created GMs');

  const am1 = await prisma.user.create({
    data: {
      email: 'am1@example.com',
      name: 'Account Manager 1',
      password: hashedPassword,
      role: 'AM',
      departmentId: salesDept.id,
      managerId: gm1.id,
    },
  });

  const am2 = await prisma.user.create({
    data: {
      email: 'am2@example.com',
      name: 'Account Manager 2',
      password: hashedPassword,
      role: 'AM',
      departmentId: salesDept.id,
      managerId: gm1.id,
    },
  });

  const am3 = await prisma.user.create({
    data: {
      email: 'am3@example.com',
      name: 'Account Manager 3',
      password: hashedPassword,
      role: 'AM',
      departmentId: marketingDept.id,
      managerId: gm2.id,
    },
  });

  console.log('Created AMs');

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  await prisma.target.create({
    data: {
      amount: 500000000,
      currency: 'IDR',
      month: currentMonth,
      year: currentYear,
      departmentId: salesDept.id,
    },
  });

  await prisma.target.create({
    data: {
      amount: 300000000,
      currency: 'IDR',
      month: currentMonth,
      year: currentYear,
      departmentId: marketingDept.id,
    },
  });

  await prisma.target.create({
    data: {
      amount: 150000000,
      currency: 'IDR',
      month: currentMonth,
      year: currentYear,
      userId: am1.id,
    },
  });

  await prisma.target.create({
    data: {
      amount: 120000000,
      currency: 'IDR',
      month: currentMonth,
      year: currentYear,
      userId: am2.id,
    },
  });

  console.log('Created targets');

  const statuses = ['prospect', 'ongoing', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];

  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        amId: am1.id,
        companyName: 'PT Maju Jaya',
        pic: 'Budi Santoso',
        phone: '+62812345678',
        email: 'budi@majujaya.com',
        potential: 50000000,
        status: 'ongoing',
        timeline: new Date(currentYear, currentMonth, 15),
      },
    }),
    prisma.customer.create({
      data: {
        amId: am1.id,
        companyName: 'CV Sukses Abadi',
        pic: 'Siti Rahayu',
        phone: '+62812345679',
        email: 'siti@suksesabadi.com',
        potential: 75000000,
        status: 'proposal',
        timeline: new Date(currentYear, currentMonth, 20),
      },
    }),
    prisma.customer.create({
      data: {
        amId: am1.id,
        companyName: 'PT Global Tech',
        pic: 'Ahmad Hidayat',
        phone: '+62812345680',
        potential: 100000000,
        status: 'closed-won',
      },
    }),
    prisma.customer.create({
      data: {
        amId: am2.id,
        companyName: 'PT Sentosa Makmur',
        pic: 'Dewi Lestari',
        phone: '+62812345681',
        email: 'dewi@sentosa.com',
        potential: 60000000,
        status: 'negotiation',
        timeline: new Date(currentYear, currentMonth + 1, 5),
      },
    }),
    prisma.customer.create({
      data: {
        amId: am2.id,
        companyName: 'CV Berkah Jaya',
        pic: 'Eko Prasetyo',
        phone: '+62812345682',
        potential: 45000000,
        status: 'prospect',
      },
    }),
    prisma.customer.create({
      data: {
        amId: am3.id,
        companyName: 'PT Indo Sejahtera',
        pic: 'Rina Wijaya',
        phone: '+62812345683',
        email: 'rina@indosejahtera.com',
        potential: 80000000,
        status: 'ongoing',
        timeline: new Date(currentYear, currentMonth, 25),
      },
    }),
    prisma.customer.create({
      data: {
        amId: am3.id,
        companyName: 'CV Prima Mandiri',
        pic: 'Hadi Gunawan',
        phone: '+62812345684',
        potential: 55000000,
        status: 'closed-won',
      },
    }),
  ]);

  console.log('Created customers');

  await Promise.all(
    customers.slice(0, 5).map((customer, i) =>
      prisma.progress.create({
        data: {
          customerId: customer.id,
          amId: customer.amId,
          description: `Initial contact with ${customer.pic}. Discussed product requirements and pricing.`,
          status: customer.status,
          date: new Date(currentDate.getTime() - (i * 2 * 24 * 60 * 60 * 1000)),
        },
      })
    )
  );

  await Promise.all(
    customers.slice(0, 3).map((customer) =>
      prisma.progress.create({
        data: {
          customerId: customer.id,
          amId: customer.amId,
          description: 'Follow-up meeting scheduled. Sent proposal document.',
          status: customer.status,
          date: new Date(currentDate.getTime() - (24 * 60 * 60 * 1000)),
        },
      })
    )
  );

  console.log('Created progress records');

  console.log('Seeding completed successfully!');
  console.log('\nDemo Users:');
  console.log('Admin: admin@example.com / password123');
  console.log('GM1: gm1@example.com / password123');
  console.log('AM1: am1@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
