<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Employeur;
use App\Models\User;

class Travailleur extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'employeur_id',
        'first_name',
        'last_name',
        'cin',
        'phone',
        'email',
        'position',
    ];

    public function employeur()
    {
        return $this->belongsTo(Employeur::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
