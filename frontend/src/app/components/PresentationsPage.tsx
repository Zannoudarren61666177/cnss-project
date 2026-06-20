import { Header } from './Header';
import { Footer } from './Footer';
import { Building2, Users, Target, Award, TrendingUp, Shield } from 'lucide-react';

export function PresentationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">Présentation de la CNSS</h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                La Caisse Nationale de Sécurité Sociale du Bénin, pilier de la protection sociale depuis 1970
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Mission</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Assurer la protection sociale des travailleurs du secteur privé et leurs familles
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Protection Sociale</h3>
                <p className="text-gray-600 text-center">
                  Garantir une couverture sociale complète pour les travailleurs et leurs ayants droit
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Service de Qualité</h3>
                <p className="text-gray-600 text-center">
                  Offrir des services efficaces et accessibles à tous nos assurés
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Innovation</h3>
                <p className="text-gray-600 text-center">
                  Moderniser nos services avec le numérique pour plus d'efficacité
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Histoire Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Créée en 1970, la Caisse Nationale de Sécurité Sociale du Bénin (CNSS) est l'institution chargée de la gestion du régime de sécurité sociale des travailleurs salariés du secteur privé.
                  </p>
                  <p>
                    Depuis plus de 50 ans, nous accompagnons les entreprises et les travailleurs dans la construction d'une protection sociale solide et durable.
                  </p>
                  <p>
                    Aujourd'hui, la CNSS gère plusieurs branches de prestations : les prestations familiales, les pensions de retraite, les risques professionnels, et bien d'autres services essentiels.
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">1970</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Création de la CNSS</h4>
                      <p className="text-sm text-gray-600">Mise en place du système de sécurité sociale</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">1990</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Extension des prestations</h4>
                      <p className="text-sm text-gray-600">Élargissement de la couverture sociale</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">2020</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Transformation digitale</h4>
                      <p className="text-sm text-gray-600">Modernisation des services en ligne</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Valeurs Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
              <p className="text-xl text-gray-600">Les principes qui guident notre action quotidienne</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Award className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Excellence</h3>
                <p className="text-sm text-gray-600">Qualité et rigueur dans nos services</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Intégrité</h3>
                <p className="text-sm text-gray-600">Transparence et honnêteté</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Solidarité</h3>
                <p className="text-sm text-gray-600">Protection pour tous</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Target className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Engagement</h3>
                <p className="text-sm text-gray-600">Service dévoué à nos assurés</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chiffres Clés */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Chiffres Clés</h2>
              <p className="text-xl text-blue-100">Notre impact en quelques chiffres</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">50+</div>
                <div className="text-blue-100">Années d'expérience</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">150K+</div>
                <div className="text-blue-100">Entreprises affiliées</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">500K+</div>
                <div className="text-blue-100">Travailleurs assurés</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">15</div>
                <div className="text-blue-100">Agences régionales</div>
              </div>
            </div>
          </div>
        </section>

        {/* Organisation */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Organisation</h2>
              <p className="text-xl text-gray-600">Une structure au service de la protection sociale</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Direction Générale</h3>
                <p className="text-gray-600">
                  Définit la stratégie et pilote l'ensemble des activités de la CNSS
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Directions Techniques</h3>
                <p className="text-gray-600">
                  Gèrent les différentes branches de prestations et services
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Agences Régionales</h3>
                <p className="text-gray-600">
                  Assurent la proximité avec les assurés sur tout le territoire
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
