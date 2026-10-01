<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssistanceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'requester_id',
        'donor_user_id',
        'donor_card_id',
        'blood_type_needed',
        'units_needed',
        'urgency',
        'needed_date',
        'hospital_name',
        'hospital_address',
        'latitude',
        'longitude',
        'distance_km',
        'message',
        'status',
        'rejection_reason',
        'accepted_at',
        'completed_at',
        'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'units_needed' => 'integer',
            'latitude' => 'float',
            'longitude' => 'float',
            'distance_km' => 'float',
            'needed_date' => 'date:Y-m-d',
            'accepted_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function donor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'donor_user_id');
    }

    public function donorCard(): BelongsTo
    {
        return $this->belongsTo(DonorCard::class, 'donor_card_id');
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(RequestStatusHistory::class)->orderBy('created_at', 'desc');
    }
}

