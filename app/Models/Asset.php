<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'location_id',
        'asset_type_id',
        'data'
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function assetType()
    {
        return $this->belongsTo(AssetType::class);
    }
}
