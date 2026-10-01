<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DonorCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'blood_type',
        'is_available',
        'verification_status',
        'rejection_reason',
        'verified_at',
        'verified_by',
        'donor_card_number',
        'search_radius_km',
        'preferred_contact_method',
        'emergency_ready',
        'last_donation_date',
        'total_donations_count',
        'notes',
        'id_document_path',
    ];

    protected function casts(): array
    {
        return [
            'is_available' => 'boolean',
            'emergency_ready' => 'boolean',
            'search_radius_km' => 'integer',
            'total_donations_count' => 'integer',
            'verified_at' => 'datetime',
            'last_donation_date' => 'date:Y-m-d',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function assistanceRequests(): HasMany
    {
        return $this->hasMany(AssistanceRequest::class);
    }
}

