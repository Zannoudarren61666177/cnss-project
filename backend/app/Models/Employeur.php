<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Travailleur;
use App\Models\User;

class Employeur extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'siret',
        'address',
        'phone',
        'email',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function travailleurs()
    {
        return $this->hasMany(Travailleur::class);
    }
}
