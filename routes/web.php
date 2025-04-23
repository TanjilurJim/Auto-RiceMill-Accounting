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
use App\Http\Controllers\ContraAddController;
use App\Http\Controllers\FinishedProductController;
use App\Http\Controllers\JournalAddController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\StockTransferController;
use App\Http\Controllers\WorkingOrderController;


use App\Http\Controllers\ReportController;
use App\Http\Controllers\SalaryReceiveController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DesignationController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\SalarySlipController;

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

    // Account Ledgers
    Route::resource('account-groups', AccountGroupController::class);
    Route::post('/account-ledgers/modal', [\App\Http\Controllers\AccountLedgerController::class, 'storeFromModal']);
    Route::resource('account-ledgers', AccountLedgerController::class);
    Route::get('/account-ledgers/{id}/balance', [AccountLedgerController::class, 'balance']);

    Route::resource('salesmen', SalesManController::class);
    Route::resource('godowns', GodownController::class);
    Route::resource('units', UnitController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('items', ItemController::class);
    Route::resource('purchases', PurchaseController::class);


    // 👇 Used only by the modal via axios



    Route::get('/purchases/{purchase}/invoice', [PurchaseController::class, 'invoice'])
        ->name('purchases.invoice');
    Route::resource('purchase-returns', PurchaseReturnController::class);
    Route::get('purchase-returns/{purchase_return}/invoice', [PurchaseReturnController::class, 'invoice'])->name('purchase-returns.invoice');
    Route::resource('sales', SaleController::class);
    Route::get('/sales/{sale}/invoice', [SaleController::class, 'invoice'])->name('sales.invoice');
    Route::get('/sales/{sale}/truck-chalan', [SaleController::class, 'truckChalan'])->name('sales.truck-chalan');
    Route::get('/sales/{sale}/load-slip', [SaleController::class, 'loadSlip'])->name('sales.load-slip');
    Route::get('/sales/{sale}/gate-pass', [SaleController::class, 'gatePass'])->name('sales.gate-pass');

    //Sales Return
    Route::resource('sales-returns', SalesReturnController::class);
    Route::get('/sales/{sale}/load', [SalesReturnController::class, 'loadSale']);
    Route::get('/sales-returns/{salesReturn}/invoice', [SalesReturnController::class, 'invoice'])->name('sales-returns.invoice');
    Route::resource('sales-orders', SalesOrderController::class);
    Route::get('/sales-orders/{salesOrder}/invoice', [SalesOrderController::class, 'invoice'])->name('sales-orders.invoice');
    Route::get('/sales/items/by-godown/{id}', [SaleController::class, 'getItemsByGodown']);

    Route::resource('received-modes', ReceivedModeController::class);
    Route::resource('received-add', ReceivedAddController::class);
    Route::get('/received-add/{receivedAdd}/print', [ReceivedAddController::class, 'print'])->name('received-add.print');
    Route::resource('payment-add', PaymentAddController::class);
    Route::get('/payment-add/{paymentAdd}/print', [PaymentAddController::class, 'print'])->name('payment-add.print');

    Route::get('company-settings', [CompanySettingController::class, 'edit'])->name('company-settings.edit');
    Route::put('company-settings', [CompanySettingController::class, 'update'])->name('company-settings.update');
    Route::resource('financial-years', FinancialYearController::class);
    Route::get('/payment-add/{voucher_no}/print', [PaymentAddController::class, 'print'])->name('payment-add.print');
    Route::resource('contra-add', ContraAddController::class);
    Route::get('/contra-add/{voucher}/print', [ContraAddController::class, 'print'])->name('contra-add.print');
    Route::resource('journal-add', JournalAddController::class);
    Route::get('/journal-add/{voucher_no}/print', [JournalAddController::class, 'print'])->name('journal-add.print');
    Route::resource('stock-transfers', StockTransferController::class);
    Route::resource('working-orders', ProductionController::class);
    Route::post('/production/{id}/mark-as-produced', [ProductionController::class, 'markAsProduced'])->name('production.markAsProduced');
    Route::resource('finished-products', FinishedProductController::class);
    Route::get(
        'finished-products/{id}/print',
        [FinishedProductController::class, 'print']
    )->name('finished-products.print');


    // Tawhid Add
    Route::resource('departments', DepartmentController::class);
    Route::resource('designations', DesignationController::class);
    Route::resource('shifts', ShiftController::class);
    Route::resource('employees', EmployeeController::class);
    // Salary
    Route::resource('salary-slips', SalarySlipController::class);
    Route::get('/salary-slips/{salarySlip}/invoice', [SalarySlipController::class, 'invoice'])->name('salary-slips.invoice');
    Route::resource('salary-receives', SalaryReceiveController::class)->parameters([
        'salary-receives' => 'salaryReceive',
    ]);
    // Employee Report
    Route::get('employee-ledger', [ReportController::class, 'employeeLedger'])->name('employee.ledger');

    //Stock Report
    Route::get('/reports/stock-summary', [ReportController::class, 'stockSummary'])->name('reports.stock-summary');
    Route::get('/reports/stock-summary/category-wise', [ReportController::class, 'categoryWiseStockSummary'])
    ->name('reports.stock-summary.category-wise');
    Route::get('/reports/stock-summary/item-wise', [ReportController::class, 'itemWiseStockSummary'])
    ->name('reports.stock-summary.item-wise');
    // DayBook
    Route::get('/reports/day-book', [ReportController::class, 'dayBook'])->name('reports.day-book');
   
});

Route::get('/reports/stock-summary/pdf', [ReportController::class, 'stockSummaryPDF'])
->name('reports.stock-summary.pdf');


Route::get('/reports/stock-summary/excel', [ReportController::class, 'stockSummaryExcel'])
->name('reports.stock-summary.excel');

Route::get('reports/stock-summary/category-wise/pdf', [ReportController::class, 'categoryWiseStockSummaryPDF'])->name('reports.stock-summary.category-wise.pdf');
Route::get('reports/stock-summary/category-wise/excel', [ReportController::class, 'categoryWiseStockSummaryExcel'])->name('reports.stock-summary.category-wise.excel');
Route::get('reports/stock-summary/item-wise/pdf', [ReportController::class, 'itemWiseStockSummaryPDF'])->name('reports.stock-summary.item-wise.pdf');
Route::get('reports/stock-summary/item-wise/excel', [ReportController::class, 'itemWiseStockSummaryExcel'])->name('reports.stock-summary.item-wise.excel');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
