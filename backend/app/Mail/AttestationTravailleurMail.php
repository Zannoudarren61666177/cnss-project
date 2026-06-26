<?php

namespace App\Mail;

use App\Models\Employeur;
use App\Models\Travailleur;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AttestationTravailleurMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $activationUrl;

    public function __construct(public Travailleur $travailleur, public Employeur $employeur)
    {
        $this->activationUrl = $this->buildActivationUrl();
    }

    private function buildActivationUrl(): string
    {
        $query = http_build_query([
            'cnss'  => $this->travailleur->numero_cnss,
            'email' => $this->travailleur->email,
            'type'  => 'travailleur',
        ]);

        return rtrim(config('app.frontend_url'), '/') . '/creer-compte?' . $query;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre affiliation CNSS a été validée',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.attestation-travailleur',
        );
    }

    public function attachments(): array
    {
        $pdf = Pdf::loadView('pdf.attestation-travailleur', [
            'travailleur' => $this->travailleur,
            'employeur'   => $this->employeur,
        ]);

        return [
            Attachment::fromData(
                fn () => $pdf->output(),
                "attestation-travailleur-{$this->travailleur->numero_cnss}.pdf"
            )->withMime('application/pdf'),
        ];
    }
}
