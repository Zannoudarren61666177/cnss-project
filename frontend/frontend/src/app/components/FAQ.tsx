import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'Comment créer mon compte employeur ?',
    reponse: 'Cliquez sur "Espace Employeur" dans le menu, puis sur "Créer un compte". Remplissez le formulaire avec votre IFU et les informations de votre entreprise. Vous recevrez un email de confirmation.'
  },
  {
    question: 'Quels sont les délais pour payer mes cotisations ?',
    reponse: 'Les cotisations doivent être payées au plus tard le 15 du mois suivant la période de travail concernée. Des pénalités peuvent s\'appliquer en cas de retard.'
  },
  {
    question: 'Comment consulter mes droits à la retraite ?',
    reponse: 'Connectez-vous à votre espace travailleur et accédez à la section "Mes droits". Vous y trouverez un récapitulatif de vos cotisations et une estimation de votre pension.'
  },
  {
    question: 'Puis-je payer mes cotisations par Mobile Money ?',
    reponse: 'Oui, nous acceptons les paiements par Mobile Money (MTN, Moov) ainsi que par carte bancaire via notre plateforme sécurisée FedaPay.'
  },
  {
    question: 'Comment obtenir une attestation d\'affiliation ?',
    reponse: 'Rendez-vous dans votre espace en ligne, section "Documents", puis cliquez sur "Attestation d\'affiliation". Le document sera généré instantanément et disponible au téléchargement.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden" id="faq">
      {/* Motif décoratif */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span className="text-blue-600 font-semibold text-sm">Aide & Support</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trouvez rapidement des réponses à vos questions sur la CNSS et nos services
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      openIndex === index ? 'bg-blue-500' : 'bg-blue-100 group-hover:bg-blue-200'
                    }`}>
                      <span className={`font-bold ${
                        openIndex === index ? 'text-white' : 'text-blue-600'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                    <span className={`font-semibold text-lg transition-colors ${
                      openIndex === index ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-blue-500 transition-transform flex-shrink-0 ml-4 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-8 pb-6 pl-20 text-gray-600 leading-relaxed">
                    {faq.reponse}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-center shadow-xl">
          <MessageCircle className="w-12 h-12 text-white mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Vous ne trouvez pas de réponse ?
          </h3>
          <p className="text-blue-100 mb-6">
            Notre équipe support est là pour vous aider
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg">
            Contacter le support
          </button>
        </div>
      </div>
    </section>
  );
}
