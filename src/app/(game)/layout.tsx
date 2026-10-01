import { BottomNav } from '@/components/hud/BottomNav';
import { GameHUD } from '@/components/hud/GameHUD';

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GameHUD />
      <main className="pb-32 lg:pb-16">{children}</main>
      <BottomNav />
    </>
  );
}
