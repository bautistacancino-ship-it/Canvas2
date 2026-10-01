import { BLOCKS_BY_ORDER, type CanvasBlockMeta } from '@/data/canvasBlocks';
import { getLevel } from '@/data/levels';
import type { BlockPhase, BlockProgress, BusinessId, CanvasBlockId } from '@/types/game';

export type LevelStatus = 'done' | 'in-progress' | 'available' | 'locked' | 'soon';

export const PHASE_FRACTION: Record<BlockPhase, number> = {
  theory: 0.1,
  quiz: 0.3,
  simulation: 0.55,
  build: 0.8,
  done: 1,
};

export interface LevelStatusItem {
  block: CanvasBlockMeta;
  status: LevelStatus;
  /** Avance dentro del nivel (0–1). */
  fraction: number;
  phase?: BlockPhase;
}

export function getLevelStatuses(
  businessId: BusinessId,
  progress: Partial<Record<CanvasBlockId, BlockProgress>>,
): LevelStatusItem[] {
  return BLOCKS_BY_ORDER.map((block, i) => {
    const prev = BLOCKS_BY_ORDER[i - 1];
    const phase = progress[block.id]?.phase;
    const unlocked = !prev || progress[prev.id]?.phase === 'done';
    const hasContent = Boolean(getLevel(businessId, block.id));

    const status: LevelStatus =
      phase === 'done' ? 'done' : !hasContent ? 'soon' : !unlocked ? 'locked' : phase ? 'in-progress' : 'available';

    return { block, status, phase, fraction: phase ? PHASE_FRACTION[phase] : 0 };
  });
}

export const isPlayable = (status: LevelStatus) => status === 'done' || status === 'in-progress' || status === 'available';

export function getCurrentLevel(items: LevelStatusItem[]) {
  return items.find((item) => item.status === 'in-progress' || item.status === 'available');
}
