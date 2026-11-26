import '@/app/nueva/nueva.css';
import NuevaExperience from '@/features/nueva/NuevaExperience';
import { loadCsvCatalogoItems } from '@/lib/data/csv-catalogo';

export default function NuevaPage() {
  const catalogItems = loadCsvCatalogoItems();
  return <NuevaExperience catalogItems={catalogItems} />;
}
