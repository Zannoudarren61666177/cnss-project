<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestMailCommand extends Command
{
    protected $signature = 'mail:test {email? : Adresse de destination}';

    protected $description = 'Envoie un email de test pour vérifier la configuration SMTP';

    public function handle(): int
    {
        $to = $this->argument('email') ?? config('mail.from.address');

        $this->info("Envoi d'un email de test à {$to}...");
        $this->line('Mailer : ' . config('mail.default'));
        $this->line('Host   : ' . config('mail.mailers.smtp.host') . ':' . config('mail.mailers.smtp.port'));

        try {
            Mail::raw(
                'Test SMTP CNSS Digital — si vous recevez ce message, la configuration mail fonctionne.',
                fn ($message) => $message->to($to)->subject('Test SMTP CNSS Digital')
            );

            $this->info('Email envoyé avec succès.');

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('Échec : ' . $e->getMessage());

            if (str_contains($e->getMessage(), '535') || str_contains($e->getMessage(), 'BadCredentials')) {
                $this->newLine();
                $this->warn('Gmail refuse le mot de passe. Utilisez un mot de passe d\'application :');
                $this->line('https://myaccount.google.com/apppasswords');
            }

            return self::FAILURE;
        }
    }
}
