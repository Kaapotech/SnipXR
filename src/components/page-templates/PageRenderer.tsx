import { PageData } from './types';
import Template1 from './Template1';
import Template2 from './Template2';
import Template3 from './Template3';
import Template4 from './Template4';
import Template5 from './Template5';
import Template6 from './Template6';

const TEMPLATES = [Template1, Template2, Template3, Template4, Template5, Template6];

export default function PageRenderer({ templateId, data }: { templateId: number; data: PageData }) {
  const Template = TEMPLATES[(templateId - 1) % TEMPLATES.length] ?? Template1;
  return <Template data={data} />;
}
