import type { BusinessId, CanvasBlockId, LevelConfig } from '@/types/game';
import { agenciaSegmentosClientes } from './agencia-marketing/01-segmentos-clientes';
import { agenciaPropuestaDeValor } from './agencia-marketing/02-propuesta-de-valor';

/**
 * Registro de niveles. Para sumar contenido: crea el archivo del nivel
 * en /data/levels/<businessId>/ y agrégalo a este arreglo.
 */
const LEVELS: LevelConfig[] = [agenciaSegmentosClientes, agenciaPropuestaDeValor];

export function getLevel(businessId: BusinessId, blockId: CanvasBlockId): LevelConfig | undefined {
  return LEVELS.find((level) => level.businessId === businessId && level.blockId === blockId);
}
