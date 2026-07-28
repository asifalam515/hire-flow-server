import { prisma } from '../src/config/prisma';

const companies = [
  {
    name: 'BMW',
    slug: 'bmw',
    field: 'Automotive',
    description: 'BMW is a multinational corporate manufacturer of luxury vehicles and motorcycles headquartered in Munich, Bavaria, Germany.',
    logoUrl: 'https://logo.clearbit.com/bmw.com'
  },
  {
    name: 'Domino\'s Pizza',
    slug: 'dominos-pizza',
    field: 'Food & Beverage',
    description: 'Domino\'s is an American multinational pizza restaurant chain founded in 1960 and is the largest pizza seller worldwide.',
    logoUrl: 'https://logo.clearbit.com/dominos.com'
  },
  {
    name: 'Procter & Gamble (P&G)',
    slug: 'procter-gamble',
    field: 'Consumer Goods',
    description: 'P&G is an American multinational consumer goods corporation headquartered in Cincinnati, Ohio, founded in 1837.',
    logoUrl: 'https://logo.clearbit.com/pg.com'
  },
  {
    name: 'Spotify',
    slug: 'spotify',
    field: 'Technology / Music',
    description: 'Spotify is a proprietary Swedish audio streaming and media services provider founded on 23 April 2006 by Daniel Ek and Martin Lorentzon.',
    logoUrl: 'https://logo.clearbit.com/spotify.com'
  },
  {
    name: 'Airbnb',
    slug: 'airbnb',
    field: 'Travel & Hospitality',
    description: 'Airbnb is an American San Francisco-based company operating an online marketplace for short-term homestays and experiences.',
    logoUrl: 'https://logo.clearbit.com/airbnb.com'
  },
  {
    name: 'Netflix',
    slug: 'netflix',
    field: 'Entertainment',
    description: 'Netflix is an American subscription streaming service and production company. Launched on August 29, 1997.',
    logoUrl: 'https://logo.clearbit.com/netflix.com'
  },
  {
    name: 'Tesla',
    slug: 'tesla',
    field: 'Automotive / Energy',
    description: 'Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas.',
    logoUrl: 'https://logo.clearbit.com/tesla.com'
  },
  {
    name: 'Nike',
    slug: 'nike',
    field: 'Apparel & Fashion',
    description: 'Nike, Inc. is an American multinational corporation that is engaged in the design, development, manufacturing, and worldwide marketing and sales of footwear, apparel, equipment, accessories, and services.',
    logoUrl: 'https://logo.clearbit.com/nike.com'
  },
  {
    name: 'Google',
    slug: 'google',
    field: 'Technology',
    description: 'Google LLC is an American multinational technology company that focuses on artificial intelligence, search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, and consumer electronics.',
    logoUrl: 'https://logo.clearbit.com/google.com'
  },
  {
    name: 'Discord',
    slug: 'discord',
    field: 'Communications',
    description: 'Discord is a VoIP and instant messaging social platform. Users have the ability to communicate with voice calls, video calls, text messaging, media and files in private chats or as part of communities called "servers".',
    logoUrl: 'https://logo.clearbit.com/discord.com'
  }
];

async function main() {
  console.log('Starting companies seed...');

  for (const company of companies) {
    const existing = await prisma.company.findUnique({
      where: { slug: company.slug }
    });

    if (!existing) {
      await prisma.company.create({
        data: company
      });
      console.log(`Created company: ${company.name}`);
    } else {
      console.log(`Company already exists: ${company.name}`);
    }
  }

  console.log('Successfully seeded 10 dummy companies!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
