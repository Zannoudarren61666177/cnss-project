<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'user_id', 'sujet', 'description', 'priorite', 'statut', 'reponse', 'date_resolution'
    ];

    protected $casts = [
        'date_resolution' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
