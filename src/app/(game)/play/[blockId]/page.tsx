import { notFound } from 'next/navigation';
import { LevelRunner } from '@/components/game/LevelRunner';
import { CANVAS_BLOCK_IDS, isCanvasBlockId } from '@/types/game';

export function generateStaticParams() {
  return CANVAS_BLOCK_IDS.map((blockId) => ({ blockId }));
}

export default async function PlayPage({ params }: { params: Promise<{ blockId: string }> }) {
  const { blockId } = await params;
  if (!isCanvasBlockId(blockId)) notFound();
  return <LevelRunner blockId={blockId} />;
}
