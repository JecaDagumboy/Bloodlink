<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BloodEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'organizer',
        'event_type',
        'description',
        'banner_path',
        'event_date',
        'start_time',
        'end_time',
        'venue',
        'province_id',
        'city_id',
        'barangay_id',
        'latitude',
        'longitude',
        'contact_person',
        'contact_number',
        'contact_email',
        'registration_link',
        'status',
        'rejection_reason',
        'is_official',
        'approved_by',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date:Y-m-d',
            'latitude' => 'float',
            'longitude' => 'float',
            'is_official' => 'boolean',
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

