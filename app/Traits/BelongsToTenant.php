<?php

namespace App\Traits;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant()
    {
        static::addGlobalScope('tenant', function ($q) {
            $ids = user_scope_ids();
            if ($ids) {
                // Qualify with the base model's table to avoid ambiguity
                $table = $q->getModel()->getTable();
                $q->whereIn("$table.created_by", $ids);
            }
        });
    }
}
