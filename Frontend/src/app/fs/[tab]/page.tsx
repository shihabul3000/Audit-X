import { FSTabClient } from '@/components/fs/FSTabClient';

interface Props {
  params: Promise<{ tab: string }>;
}

export default async function FSTabPage({ params }: Props) {
  const { tab } = await params;
  return <FSTabClient tab={tab} />;
}

export function generateStaticParams() {
  return [
    { tab: 'cover' },
    { tab: 'sfp' },
    { tab: 'pnl' },
    { tab: 'sce' },
    { tab: 'scf' },
    // { tab: 'p_discussion' }, // P_Discussion temporarily hidden — uncomment to restore route /fs/p_discussion
    { tab: 'n4-13' },
    { tab: 'ppe' },
  ];
}
