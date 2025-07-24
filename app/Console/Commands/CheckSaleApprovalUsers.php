<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class CheckSaleApprovalUsers extends Command
{
    protected $signature   = 'debug:sale-approval-users {--user=}';
    protected $description = 'Show tenant-scope user IDs and who can approve sales';

    public function handle(): int
    {
        /* -------------------------------------------------
         * 1️⃣  Pick a user context (required)
         * -------------------------------------------------*/
        $uid = $this->option('user');

        if (!$uid || !($user = User::find($uid))) {
            $this->error('Please pass a valid --user=15 to impersonate.');
            return self::INVALID;
        }

        Auth::login($user);
        $this->comment("Impersonating user #{$user->id} ({$user->name})");

        /* -------------------------------------------------
         * 2️⃣  Run the same checks as before
         * -------------------------------------------------*/
        $scope = user_scope_ids();
        $this->line('🔹 user_scope_ids(): [' . implode(', ', $scope) . ']');

        $subIds  = User::permission('sales.approve-sub')
              ->whereIn('id', $scope)->pluck('id')->toArray();
        $this->line('🔹 users with sales.approve-sub: [' . implode(', ', $subIds) . ']');

        $respIds = User::permission('sales.approve')
              ->whereIn('id', $scope)->pluck('id')->toArray();
        $this->line('🔹 users with sales.approve   : [' . implode(', ', $respIds) . ']');

        Auth::logout();
        $this->info('Done.');
        return self::SUCCESS;
    }
}
