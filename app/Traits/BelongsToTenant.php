<?php

namespace App\Traits;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant()
    {
        static::addGlobalScope('tenant', function ($q) {
            $ids = user_scope_ids();
            if ($ids) {
                $q->whereIn('created_by', $ids);
            }
        });
    }
}



