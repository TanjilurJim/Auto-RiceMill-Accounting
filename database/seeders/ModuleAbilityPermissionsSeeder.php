<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class ModuleAbilityPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $abilities = [
            'view',
            'create',
            'edit',
            'delete',
            'restore',
            'force-delete',
            'export',
            'pdf'
        ];

        $modules = [
            'users',
            'roles',
            'permissions',
            'Dashboard',
            'salary-owed',
            'salary-slips',
            'sales',
            'purchases',
            'purchases-return',
            'sales-return',
            'dues',
            'unit',
            'items',
            'categories',
            'items',
            'received-modes',
            'received-add',
            'payment-add',
            'contra-add',
            'journal-add',
            'stock-transfer',
            'dues-settled',
            'account-ledger',
            'salesman',
            'godowns',
            'working-orders',
            'finished-products',
            'departments',
            'designations',
            'shifts',
            'salary-payments',
            'employee-ledger',
            'employee-reports',
            'stock-reports',
            'reports',
            'daybook-report',
            'profit-loss-report',
            'balance-sheet-report',
            'account-book-report',
            'ledger-group-summary',
            'sale-report',
            'purchase-report',
            'receivable-payable-report',
            'receive-payment-report',
            'crushing-party-report',
            'crushing-party-stock',
            'crushing-party-withdraw',
            'crushing-party-convert',
            'crushing-daybook',
            'crushing-voucher',


            'employees',
            'company-settings',
            'financial-year',

            // Add more modules below as your app grows
            // 'sales', 'purchases', 'employees', etc.
        ];

        $createdPermissions = [];

        foreach ($modules as $module) {
            foreach ($abilities as $ability) {
                $name = "{$module}.{$ability}";
                $permission = Permission::firstOrCreate(['name' => $name]);
                $createdPermissions[] = $permission->name;
            }
        }

        // Give all to admin
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions($createdPermissions);
    }
}
