<?php

namespace App\Mail;

use App\Models\Cotisation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CotisationNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Cotisation $cotisation,
        public string     $type,           // generee | rappel | jour_j | penalite
        public float      $montantPenalite = 0,
        public float      $taux            = 0,
    ) {}

    public function envelope(): Envelope
    {
        $sujets = [
            'generee'  => 'Nouvelle cotisation CNSS disponible',
            'rappel'   => 'Rappel : votre cotisation est due dans 3 jours',
            'jour_j'   => "Aujourd'hui : dernier jour de paiement de votre cotisation",
            'penalite' => 'Pénalité appliquée sur votre cotisation CNSS',
        ];

        return new Envelope(
            subject: $sujets[$this->type] ?? 'Notification CNSS',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.cotisation-notification',
        );
    }
}