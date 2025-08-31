<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class DeactivateExpiredTrials extends Command
{
    protected $signature = 'users:deactivate-expired-trials';
    protected $description = 'Deactivate users whose trial has ended and remove owner role';

    public function handle(): int
    {
        $total = 0;

        User::query()
            ->where('status', 'active')
            ->whereNotNull('trial_ends_at')
            ->where('trial_ends_at', '<=', now())
            ->select(['id']) // keep memory small
            ->chunkById(200, function ($users) use (&$total) {
                foreach ($users as $u) {
                    // re-fetch full model with roles relationship available
                    $user = User::find($u->id);

                    // flip status
                    $user->status = 'inactive';
                    $user->save();

                    // remove the trial role if present
                    if ($user->hasRole('Owner')) {
                        $user->removeRole('Owner');
                    }

                    $total++;
                }
            });

        $this->info("Deactivated {$total} users and removed 'owner' role where present.");
        return self::SUCCESS;
    }
}
