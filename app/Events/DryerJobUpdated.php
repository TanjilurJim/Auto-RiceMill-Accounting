<?php
// app/Events/DryerJobUpdated.php
namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow; // 👈
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DryerJobUpdated implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    // Remove $connection property; not needed for *Now*
    public bool $afterCommit = true;

    public function __construct(
        public int $tenantId,
        public array $payload // e.g. ['job_id'=>..., 'dryer_id'=>..., 'status'=>'started'|'stopped', ...]
    ) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel("dryers.{$this->tenantId}");
    }

    public function broadcastAs(): string
    {
        return 'dryer.job.updated'; // 👈 custom event name
    }

    public function broadcastWith(): array
    {
        return $this->payload;
    }
}
