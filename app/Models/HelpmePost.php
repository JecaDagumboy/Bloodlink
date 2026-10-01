<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HelpmePost extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'blood_type_needed',
        'units_needed',
        'urgency',
        'needed_date',
        'hospital_name',
        'province_id',
        'city_id',
        'barangay_id',
        'location_name',
        'contact_number',
        'contact_email',
        'description',
        'photo_path',
        'status',
        'rejection_reason',
        'approved_by',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'units_needed' => 'integer',
            'needed_date' => 'date:Y-m-d',
            'approved_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}

