import Footer from '@/shared/components/Footer/view/Footer';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div>
      <header>Header</header>
      <main>
        <Outlet />
      </main>
      <Footer></Footer>
    </div>
  );
};
