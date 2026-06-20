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
    <section className="py-12 bg-white" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 rounded-full mb-4">
            <HelpCircle className="w-4 h-4 text-sky-500" />
            <span className="text-sky-500 font-medium text-sm">Aide & Support</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
            Questions fréquentes
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Réponses essentielles et rapides sur la CNSS et nos services
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-all duration-150 group"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      openIndex === index ? 'bg-sky-600' : 'bg-sky-50 group-hover:bg-sky-100'
                    }`}>
                      <span className={`font-semibold text-sm ${
                        openIndex === index ? 'text-white' : 'text-sky-500'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                    <span className={`font-medium text-base transition-colors ${
                      openIndex === index ? 'text-sky-600' : 'text-gray-900 group-hover:text-sky-600'
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                    <ChevronDown
                    className={`w-5 h-5 text-sky-500 transition-transform flex-shrink-0 ml-3 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openIndex === index ? 'max-h-60' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-4 pl-14 text-gray-600 text-sm leading-relaxed">
                    {faq.reponse}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-5 rounded-lg text-center bg-blue-50 border border-blue-100">
          <div className="flex items-center justify-center gap-3">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">Besoin d'aide supplémentaire ?</h3>
              <p className="text-sm text-gray-600">Notre équipe support répond rapidement à vos demandes</p>
            </div>
          </div>
          <div className="mt-4">
            <button className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium text-sm transition-all shadow-sm">
              Contacter le support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
