import { Footer } from '@/shared/components/Footer/view/Footer';
import { Header } from '@/shared/components/Header/view/Header';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div>
      <Header></Header>
      <main>
        <Outlet />
      </main>
      <Footer></Footer>
    </div>
  );
};
