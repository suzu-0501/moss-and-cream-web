import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CafeHome from '../app/page';
import ProductExperience from '../app/menu/pistachio-tiramisu-latte/page';
import '../app/globals.css';

const isProductPage = window.location.pathname.includes('/menu/pistachio-tiramisu-latte');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isProductPage ? <ProductExperience /> : <CafeHome />}
  </StrictMode>,
);
