import { Header } from './Header';
import { HeroSlider } from './HeroSlider';
import { Prestations } from './Prestations';
import { Actualites } from './Actualites';
import { FAQ } from './FAQ';
import { Footer } from './Footer';
import { PublicLayout } from './PublicLayout';
import { AgencesMap } from './AgencesMap';
import { Partenaires } from './Partenaires';

export function HomePage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <HeroSlider />
          <Prestations />
          <Actualites />
          <FAQ />
          <AgencesMap />
          <Partenaires />
        </main>
        <Footer />
      </div>
    </PublicLayout>
  );
}
