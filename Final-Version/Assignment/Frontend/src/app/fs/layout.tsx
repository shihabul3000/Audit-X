import { FSLayoutClient } from '@/components/fs/FSLayoutClient';

export default function FSLayout({ children }: { children: React.ReactNode }) {
  return <FSLayoutClient>{children}</FSLayoutClient>;
}
