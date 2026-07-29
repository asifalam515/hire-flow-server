import { prisma } from '../src/config/prisma';

const companies = [
  {
    name: 'BMW',
    slug: 'bmw',
    field: 'Automotive',
    description: 'BMW is a multinational corporate manufacturer of luxury vehicles and motorcycles headquartered in Munich, Bavaria, Germany.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg'
  },
  {
    name: 'Domino\'s Pizza',
    slug: 'dominos-pizza',
    field: 'Food & Beverage',
    description: 'Domino\'s is an American multinational pizza restaurant chain founded in 1960 and is the largest pizza seller worldwide.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Domino%27s_pizza_logo.svg'
  },
  {
    name: 'Procter & Gamble (P&G)',
    slug: 'procter-gamble',
    field: 'Consumer Goods',
    description: 'P&G is an American multinational consumer goods corporation headquartered in Cincinnati, Ohio, founded in 1837.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Procter_%26_Gamble_logo.svg'
  },
  {
    name: 'Spotify',
    slug: 'spotify',
    field: 'Technology / Music',
    description: 'Spotify is a proprietary Swedish audio streaming and media services provider founded on 23 April 2006 by Daniel Ek and Martin Lorentzon.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg'
  },
  {
    name: 'Airbnb',
    slug: 'airbnb',
    field: 'Travel & Hospitality',
    description: 'Airbnb is an American San Francisco-based company operating an online marketplace for short-term homestays and experiences.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg'
  },
  {
    name: 'Netflix',
    slug: 'netflix',
    field: 'Entertainment',
    description: 'Netflix is an American subscription streaming service and production company. Launched on August 29, 1997.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg'
  },
  {
    name: 'Tesla',
    slug: 'tesla',
    field: 'Automotive / Energy',
    description: 'Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg'
  },
  {
    name: 'Nike',
    slug: 'nike',
    field: 'Apparel & Fashion',
    description: 'Nike, Inc. is an American multinational corporation that is engaged in the design, development, manufacturing, and worldwide marketing and sales of footwear, apparel, equipment, accessories, and services.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg'
  },
  {
    name: 'Google',
    slug: 'google',
    field: 'Technology',
    description: 'Google LLC is an American multinational technology company that focuses on artificial intelligence, search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, and consumer electronics.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
  },
  {
    name: 'Discord',
    slug: 'discord',
    field: 'Communications',
    description: 'Discord is a VoIP and instant messaging social platform. Users have the ability to communicate with voice calls, video calls, text messaging, media and files in private chats or as part of communities called "servers".',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Discord_logo.svg'
  }
];

async function main() {
  console.log('Starting companies seed (Update/Upsert)...');

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
      await prisma.company.update({
        where: { slug: company.slug },
        data: { logoUrl: company.logoUrl }
      });
      console.log(`Updated company logo: ${company.name}`);
    }
  }

  console.log('Successfully seeded/updated 10 dummy companies!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
