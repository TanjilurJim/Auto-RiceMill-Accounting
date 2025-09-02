<?php
// app/Events/DryerJobUpdated.php
namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DryerJobUpdated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public int $tenantId,
        public array $payload // {job_id, dryer_id, status:'started'|'stopped', ...}
    ) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel("dryers.{$this->tenantId}");
    }

    public function broadcastAs(): string
    {
        return 'dryer.job.updated';
    }

    public function broadcastWith(): array
    {
        return $this->payload;
    }
}
