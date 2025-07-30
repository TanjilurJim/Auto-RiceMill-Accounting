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