<?php

namespace App\Mail;

use App\Models\Employeur;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AttestationEmployeurMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $activationUrl;

    public function __construct(public Employeur $employeur)
    {
        $query = http_build_query([
            'cnss'  => $employeur->numero_cnss,
            'email' => $employeur->email,
        ]);

        $this->activationUrl = rtrim(config('app.frontend_url'), '/') . '/creer-compte?' . $query;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre immatriculation CNSS a été validée',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.attestation-employeur',
        );
    }

    public function attachments(): array
    {
        $pdf = Pdf::loadView('pdf.attestation-employeur', ['employeur' => $this->employeur]);

        return [
            Attachment::fromData(
                fn () => $pdf->output(),
                "attestation-cnss-{$this->employeur->numero_cnss}.pdf"
            )->withMime('application/pdf'),
        ];
    }
}
