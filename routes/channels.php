<?php
// routes/channels.php

use Illuminate\Support\Facades\Broadcast;

/*
|---------------------------------------------------------------------------
| Broadcast Channels
|---------------------------------------------------------------------------
*/

Broadcast::channel(
    'approvals.{userId}',
    fn ($user, $userId) => $user->id === (int) $userId
);

Broadcast::channel('dryers.{tenantId}', function ($user, $tenantId) {
    return (int)$user->tenant_id === (int)$tenantId;
});