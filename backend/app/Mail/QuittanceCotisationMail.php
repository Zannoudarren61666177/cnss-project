<?php

namespace App\Mail;

use App\Models\Cotisation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuittanceCotisationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Cotisation $cotisation)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre quittance de cotisation CNSS',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.quittance-cotisation',
            with: [
                'cotisation' => $this->cotisation,
            ],
        );
    }

    public function attachments(): array
    {
        $pdf = Pdf::loadView('pdf.quittance-cotisation', ['cotisation' => $this->cotisation]);

        return [
            Attachment::fromData(
                fn () => $pdf->output(),
                'quittance-cotisation-' . $this->cotisation->id . '.pdf'
            )->withMime('application/pdf'),
        ];
    }
}
