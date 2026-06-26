<?php

namespace App\Mail;

use App\Models\Employeur;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RejetEmployeurMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Employeur $employeur, public string $raison) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre immatriculation CNSS a été rejetée',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.rejet-employeur',
        );
    }
}
