<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'id', 'name', 'type', 'parent_id', 'x', 'y', 'color',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function parent()
    {
        return $this->belongsTo(Location::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Location::class, 'parent_id');
    }


    public function assets()
    {
        return $this->hasMany(Asset::class);
    }
}
