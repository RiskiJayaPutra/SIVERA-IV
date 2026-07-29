<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'schema'
    ];

    protected $casts = [
        'schema' => 'array',
    ];

    public function assets()
    {
        return $this->hasMany(Asset::class);
    }
}
