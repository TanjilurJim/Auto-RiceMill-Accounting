<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AccountGroupController;
use App\Http\Controllers\AccountLedgerController;
use App\Http\Controllers\SalesManController;
use App\Http\Controllers\GodownController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\PurchaseReturnController;
use App\Http\Controllers\SalesOrderController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SalesReturnController;
use App\Http\Controllers\ReceivedModeController;
use App\Http\Controllers\ReceivedAddController;
use App\Http\Controllers\PaymentAddController;
use App\Http\Controllers\CompanySettingController;
use App\Http\Controllers\FinancialYearController;

use App\Models\Purchase;
use App\Models\SalesReturn;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard - open to all verified users
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Users - requires permission: manage-users
    Route::middleware(['permission:manage-users'])->group(function () {
        Route::resource('users', UserController::class);
        Route::prefix('users')->name('users.')->group(function () {
            Route::patch('/{id}/restore', [UserController::class, 'restore'])->name('restore');
            Route::delete('/{id}/force-delete', [UserController::class, 'forceDelete'])->name('force-delete');
        });
    });

    // Roles - requires permission: manage-roles
    Route::middleware(['permission:manage-roles'])->group(function () {
        Route::resource('roles', RoleController::class);
    });

    // Permissions - requires permission: manage-permissions
    Route::middleware(['permission:manage-permissions'])->group(function () {
        Route::resource('permissions', PermissionController::class);
    });

    Route::resource('account-groups', AccountGroupController::class);
    Route::resource('account-ledgers', AccountLedgerController::class);

    Route::resource('salesmen', SalesManController::class);
    Route::resource('godowns', GodownController::class);
    Route::resource('units', UnitController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('items', ItemController::class);
    Route::resource('purchases', PurchaseController::class);
    Route::get('/purchases/{purchase}/invoice', [PurchaseController::class, 'invoice'])
        ->name('purchases.invoice');
    Route::resource('purchase-returns', PurchaseReturnController::class);
    Route::get('purchase-returns/{purchase_return}/invoice', [PurchaseReturnController::class, 'invoice'])->name('purchase-returns.invoice');
    Route::resource('sales', SaleController::class);
    Route::get('/sales/{sale}/invoice', [SaleController::class, 'invoice'])->name('sales.invoice');
    Route::get('/sales/{sale}/truck-chalan', [SaleController::class, 'truckChalan'])->name('sales.truck-chalan');
    Route::get('/sales/{sale}/load-slip', [SaleController::class, 'loadSlip'])->name('sales.load-slip');
    Route::get('/sales/{sale}/gate-pass', [SaleController::class, 'gatePass'])->name('sales.gate-pass');

    Route::resource('sales-returns', SalesReturnController::class);
    Route::get('/sales-returns/{salesReturn}/invoice', [SalesReturnController::class, 'invoice'])->name('sales-returns.invoice');
    Route::resource('sales-orders', SalesOrderController::class);
    Route::get('/sales-orders/{salesOrder}/invoice', [SalesOrderController::class, 'invoice'])->name('sales-orders.invoice');

    Route::resource('received-modes', ReceivedModeController::class);
    Route::resource('received-add', ReceivedAddController::class);
    Route::get('/received-add/{receivedAdd}/print', [ReceivedAddController::class, 'print'])->name('received-add.print');
    Route::resource('payment-add', PaymentAddController::class);
    Route::get('/payment-add/{paymentAdd}/print', [PaymentAddController::class, 'print'])->name('payment-add.print');

    Route::get('company-settings', [CompanySettingController::class, 'edit'])->name('company-settings.edit');
    Route::put('company-settings', [CompanySettingController::class, 'update'])->name('company-settings.update');
    Route::resource('financial-years', FinancialYearController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
