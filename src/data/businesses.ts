import type { BusinessId, CoreBusiness } from '@/types/game';

export const CORE_BUSINESSES: CoreBusiness[] = [
  {
    id: 'agencia-marketing',
    name: 'Agencia de Marketing Digital y Diseño Web',
    tagline: 'Sitios, campañas y automatizaciones para pymes que quieren crecer online.',
    emoji: '🚀',
    available: true,
  },
  {
    id: 'estudio-animacion',
    name: 'Estudio de Animación 2D/3D',
    tagline: 'Explainers, motion graphics y contenido animado para marcas.',
    emoji: '🎬',
    available: false,
  },
  {
    id: 'branding-estudio',
    name: 'Estudio de Branding e Identidad Visual',
    tagline: 'Logos, sistemas de identidad y manuales de marca.',
    emoji: '🎨',
    available: false,
  },
];

export const getBusiness = (id: BusinessId) => CORE_BUSINESSES.find((b) => b.id === id);
