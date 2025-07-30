<?php 
namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ApprovalCountersUpdated implements ShouldBroadcast
{
    public function __construct(
        public int   $userId,
        public array $counters
    ) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('approvals.' . $this->userId);
    }

    public function broadcastWith(): array
    {
        return ['counters' => $this->counters];
    }
}