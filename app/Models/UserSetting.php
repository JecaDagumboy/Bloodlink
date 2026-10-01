<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'theme',
        'show_phone',
        'location_privacy',
        'show_donor_availability',
        'profile_visibility',
        'notify_requests',
        'notify_helpme',
        'notify_events',
        'notify_community',
    ];

    protected function casts(): array
    {
        return [
            'show_phone' => 'boolean',
            'show_donor_availability' => 'boolean',
            'notify_requests' => 'boolean',
            'notify_helpme' => 'boolean',
            'notify_events' => 'boolean',
            'notify_community' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

