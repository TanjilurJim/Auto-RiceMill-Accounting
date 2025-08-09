<?php

use Inertia\Inertia;
use App\Models\Purchase;
use App\Models\SalesReturn;
use App\Models\AccountLedger;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DueController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DryerController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\GodownController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SalesManController;
use App\Http\Controllers\ContraAddController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PartyItemController;
use App\Http\Controllers\StockMoveController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\JournalAddController;
use App\Http\Controllers\PartyStockController;
use App\Http\Controllers\PaymentAddController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\ProfitLossController;
use App\Http\Controllers\SalaryOwedController;
use App\Http\Controllers\SalarySlipController;
use App\Http\Controllers\SalesOrderController;
use App\Http\Controllers\DesignationController;
use App\Http\Controllers\ReceivedAddController;
use App\Http\Controllers\RentVoucherController;
use App\Http\Controllers\SalesReturnController;
use App\Http\Controllers\AccountGroupController;
use App\Http\Controllers\BalanceSheetController;
use App\Http\Controllers\ReceivedModeController;
use App\Http\Controllers\SaleApprovalController;
use App\Http\Controllers\WorkingOrderController;
use App\Http\Controllers\AccountLedgerController;
use App\Http\Controllers\FinancialYearController;
use App\Http\Controllers\SalaryReceiveController;
use App\Http\Controllers\StockTransferController;
use App\Http\Controllers\CompanySettingController;
use App\Http\Controllers\PartyStockMoveController;
use App\Http\Controllers\PurchaseReportController;
use App\Http\Controllers\PurchaseReturnController;
use App\Http\Controllers\FinishedProductController;
use App\Http\Controllers\PartyStockReportController;
use App\Http\Controllers\PurchaseApprovalController;
use App\Http\Controllers\ConversionVoucherController;

use App\Http\Controllers\LedgerGroupReportController;


use App\Http\Controllers\PartyStockDepositController;
use App\Http\Controllers\PartyStockWithdrawController;
use App\Http\Controllers\PartyStockAdjustmentController;
use App\Http\Controllers\AllReceivedPaymentReportController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\AllReceivablePayableReportController;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::get('/', function () {
    return view('welcome');
})->name('home');

// Route::get('/', function () {
//     return view('welcome'); // Use the Blade view here
// })->name('home');

Route::get('/about', function () {
    return view('about');
})->name('about');

Route::get('/contacts', function () {
    return view('contacts');
})->name('contacts');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');


Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard - open to all verified users
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Users - requires permission: manage-users
    // Route::middleware(['permission:manage-users'])->group(function () {
    //     Route::resource('users', UserController::class);
    //     Route::prefix('users')->name('users.')->group(function () {
    //         Route::patch('/{id}/restore', [UserController::class, 'restore'])->name('restore');
    //         Route::delete('/{id}/force-delete', [UserController::class, 'forceDelete'])->name('force-delete');
    //     });
    // });

    // Roles - requires permission: manage-roles
    // Route::middleware(['permission:manage-roles'])->group(function () {
    //     Route::resource('roles', RoleController::class);
    // });

    // Permissions - requires permission: manage-permissions
    // Route::middleware(['permission:manage-permissions'])->group(function () {
    //     Route::resource('permissions', PermissionController::class);
    // });

    //users module.ability

    Route::prefix('users')->name('users.')->group(function () {
        Route::middleware('permission:users.view')->get('/',              [UserController::class, 'index'])->name('index');
        Route::middleware('permission:users.create')->get('/create',      [UserController::class, 'create'])->name('create');
        Route::middleware('permission:users.create')->post('/',           [UserController::class, 'store'])->name('store');
        Route::middleware('permission:users.view')->get('/{id}',          [UserController::class, 'show'])->name('show');
        Route::middleware('permission:users.edit')->get('/{id}/edit',     [UserController::class, 'edit'])->name('edit');
        Route::middleware('permission:users.edit')->put('/{id}',          [UserController::class, 'update'])->name('update');
        Route::middleware('permission:users.delete')->delete('/{id}',     [UserController::class, 'destroy'])->name('destroy');
        Route::middleware('permission:users.restore')->patch('/{id}/restore', [UserController::class, 'restore'])->name('restore');
        Route::middleware('permission:users.force-delete')->delete('/{id}/force-delete', [UserController::class, 'forceDelete'])->name('force-delete');
    });

    // ── Permissions (module.ability) ─────────────────────────────────
    // ── Permissions (module.ability) ─────────────────────────────────
    Route::prefix('permissions')->name('permissions.')->group(function () {
        Route::middleware('permission:permissions.view')
            ->get('/',               [PermissionController::class, 'index'])
            ->name('index');

        Route::middleware('permission:permissions.create')
            ->get('/create',         [PermissionController::class, 'create'])
            ->name('create');
        Route::middleware('permission:permissions.create')
            ->post('/',              [PermissionController::class, 'store'])
            ->name('store');

        Route::middleware('permission:permissions.edit')
            ->get('/{id}/edit',      [PermissionController::class, 'edit'])
            ->name('edit');
        Route::middleware('permission:permissions.edit')
            ->put('/{id}',           [PermissionController::class, 'update'])
            ->name('update');

        Route::middleware('permission:permissions.delete')
            ->delete('/{id}',        [PermissionController::class, 'destroy'])
            ->name('destroy');
    });


    // ── Roles (module.ability) ───────────────────────────────────────
    Route::prefix('roles')->name('roles.')->group(function () {
        Route::middleware('permission:roles.view')
            ->get('/',               [RoleController::class, 'index'])
            ->name('index');

        Route::middleware('permission:roles.create')
            ->get('/create',         [RoleController::class, 'create'])
            ->name('create');
        Route::middleware('permission:roles.create')
            ->post('/',              [RoleController::class, 'store'])
            ->name('store');

        Route::middleware('permission:roles.edit')
            ->get('/{id}/edit',      [RoleController::class, 'edit'])
            ->name('edit');
        Route::middleware('permission:roles.edit')
            ->put('/{id}',           [RoleController::class, 'update'])
            ->name('update');

        Route::middleware('permission:roles.delete')
            ->delete('/{id}',        [RoleController::class, 'destroy'])
            ->name('destroy');
    });


    // Account Ledgers
    Route::resource('account-groups', AccountGroupController::class);

    Route::get('/account-ledgers/{ledger}/balance', function (AccountLedger $ledger) {
        // if closing_balance is null, fall back to opening_balance
        return response()->json([
            'closing_balance' => $ledger->closing_balance ?? $ledger->opening_balance ?? 0,
            'debit_credit'    => $ledger->debit_credit      // we may use this later
        ]);
    })->name('account-ledgers.balance');

    Route::post('/account-ledgers/modal', [\App\Http\Controllers\AccountLedgerController::class, 'storeFromModal']);
    Route::resource('account-ledgers', AccountLedgerController::class);
    Route::get('/account-ledgers/{id}/balance', [AccountLedgerController::class, 'balance']);

    Route::resource('salesmen', SalesManController::class);
    Route::resource('godowns', GodownController::class);

    // item lot shoho pick korar jonno
    Route::get(
        'godowns/{godown}/stocks-with-lots',
        [SaleController::class, 'stocksWithLots']
    )
        ->name('godown.stocks-with-lots');


    Route::resource('units', UnitController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('items', ItemController::class);

    // ---------------------------
    // Approval inboxes
    // ---------------------------
    Route::get('/purchases/inbox/sub',  [PurchaseController::class, 'inboxSub'])->name('purchases.inbox.sub');
    Route::get('/purchases/inbox/resp', [PurchaseController::class, 'inboxResp'])->name('purchases.inbox.resp');
    Route::get('approvals', [PurchaseApprovalController::class, 'index'])
        ->name('purchases.approvals');

    // ---------------------------
    // Approval actions
    // ---------------------------
    Route::post('purchases/{purchase}/approve-sub',   [PurchaseController::class, 'approveSub'])->name('purchases.approve-sub');
    Route::post('purchases/{purchase}/approve-final', [PurchaseController::class, 'approveFinal'])->name('purchases.approve-final');
    Route::post('purchases/{purchase}/reject',        [PurchaseController::class, 'reject'])->name('purchases.reject');

    // ---------------------------
    // Invoice preview (used by modal via axios)
    // ---------------------------
    Route::get('purchases/{purchase}/invoice', [PurchaseController::class, 'invoice'])->name('purchases.invoice');

    // ---------------------------
    // Resourceful routes
    // ---------------------------
    Route::resource('purchases', PurchaseController::class);
    Route::resource('purchase-returns', PurchaseReturnController::class);


    Route::get('/sales/inbox/sub',  [SaleController::class, 'inboxSub'])->name('sales.inbox.sub');
    Route::get('/sales/inbox/resp', [SaleController::class, 'inboxResp'])->name('sales.inbox.resp');
    Route::get('/sales/approvals', [SaleApprovalController::class, 'index'])
        ->name('sales.approvals');


    // existing approve / reject posts
    Route::post('/sales/{sale}/approve-sub',   [SaleController::class, 'approveSub'])->name('sales.approve.sub');
    Route::post('/sales/{sale}/approve-final', [SaleController::class, 'approveFinal'])->name('sales.approve.final');
    Route::post('/sales/{sale}/reject',        [SaleController::class, 'reject'])->name('sales.reject');

    Route::get('purchase-returns/{purchase_return}/invoice', [PurchaseReturnController::class, 'invoice'])->name('purchase-returns.invoice');
    Route::resource('sales', SaleController::class)->names([
        'index'   => 'sales.index',
        'create'  => 'sales.create',
        'store'   => 'sales.store',
        'show'    => 'sales.show',
        'edit'    => 'sales.edit',
        'update'  => 'sales.update',
        'destroy' => 'sales.destroy',
    ]);

    Route::prefix('sales')->name('sales.')->middleware('permission:sales.view')->group(function () {
        Route::get('{sale}/invoice', [SaleController::class, 'invoice'])->name('invoice');
        Route::get('{sale}/truck-chalan', [SaleController::class, 'truckChalan'])->name('truck-chalan');
        Route::get('{sale}/load-slip', [SaleController::class, 'loadSlip'])->name('load-slip');
        Route::get('{sale}/gate-pass', [SaleController::class, 'gatePass'])->name('gate-pass');
    });

    // sale responsible
    // 👇 approval inboxes


    //Sales Return
    Route::resource('sales-returns', SalesReturnController::class);
    Route::get('/sales/{sale}/load', [SalesReturnController::class, 'loadSale']);
    Route::get('/sales-returns/{salesReturn}/invoice', [SalesReturnController::class, 'invoice'])->name('sales-returns.invoice');
    Route::resource('sales-orders', SalesOrderController::class);
    Route::get('/sales-orders/products/by-godown/{id}', [SalesOrderController::class, 'getProductsByGodown']);
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

    // employee salary report
    Route::get(
        'employees/{employee}/salary-report',
        [EmployeeController::class, 'salaryReport']
    )->name('employees.salary-report');



    // Salary
    Route::resource('salary-slips', SalarySlipController::class);
    Route::get('/salary-slips/{salarySlip}/invoice', [SalarySlipController::class, 'invoice'])->name('salary-slips.invoice');
    Route::resource('salary-receives', SalaryReceiveController::class)->parameters([
        'salary-receives' => 'salaryReceive',
    ]);
    // Employee Report
    Route::get('employee-ledger', [ReportController::class, 'employeeLedger'])->name('employee.ledger');
    Route::prefix('employee-reports')
        ->name('employee-reports.')
        ->group(function () {
            Route::get('/', [\App\Http\Controllers\EmployeeReportController::class, 'index'])
                ->name('index');
        });

    //Stock Report
    Route::get('/reports/stock-summary', [ReportController::class, 'stockSummary'])->name('reports.stock-summary');
    Route::get('/reports/stock-summary/category-wise', [ReportController::class, 'categoryWiseStockSummary'])
        ->name('reports.stock-summary.category-wise');
    Route::get('/reports/stock-summary/item-wise', [ReportController::class, 'itemWiseStockSummary'])
        ->name('reports.stock-summary.item-wise');
    // DayBook
    Route::get('/reports/day-book', [ReportController::class, 'dayBook'])->name('reports.day-book');

    // Account Ledger Report
    Route::get('/reports/account-book', [ReportController::class, 'accountBook'])->name('reports.account-book');
    // account-group wise
    Route::get('/reports/ledger-group-summary/filter', [LedgerGroupReportController::class, 'filter'])->name('reports.ledger-group-summary.filter');
    Route::get('/reports/ledger-group-summary', [LedgerGroupReportController::class, 'index'])->name('reports.ledger-group-summary');

    // Purchase Report
    Route::redirect('/reports/purchase', '/reports/purchase/filter');
    Route::prefix('reports/purchase')->name('reports.purchase.')->group(function () {
        Route::get('filter/{tab?}', [PurchaseReportController::class, 'filter'])
            ->where('tab', 'category|item|party|return|all')
            ->name('filter');              // default hits “category”
        Route::get('{tab}',        [PurchaseReportController::class, 'index'])
            ->where('tab', 'category|item|party|return|all')
            ->name('index');
        Route::get('{tab}/export', [PurchaseReportController::class, 'export'])
            ->where('tab', 'category|item|party|return|all')
            ->name('export');
    });

    // Sales Report

    Route::redirect('/reports/sale', '/reports/sale/filter');
    Route::prefix('reports/sale')->name('reports.sale.')->group(function () {
        Route::get('filter/{tab?}', [\App\Http\Controllers\SaleReportController::class, 'filter'])
            ->where('tab', 'category|item|party|godown|salesman|all|return')
            ->name('filter'); // default hit "category"

        Route::get('{tab}', [\App\Http\Controllers\SaleReportController::class, 'index'])
            ->where('tab', 'category|item|party|godown|salesman|all|return')
            ->name('index');

        Route::get('{tab}/export', [\App\Http\Controllers\SaleReportController::class, 'export'])
            ->where('tab', 'category|item|party|godown|salesman|all|return')
            ->name('export');
    });

    // All Receivable Payable Report
    // Filter Page (Step 1)

    // Route::get('/reports/receivable-payable/filter', function () {
    //     return Inertia::render('reports/AllReceivablePayableFilter');
    // })->name('reports.receivable-payable.filter');

    Route::get('/reports/receivable-payable/filter', [AllReceivablePayableReportController::class, 'filter'])
        ->name('reports.receivable-payable.filter');

    // Final Report Page (Step 2)
    Route::get('/reports/receivable-payable', [AllReceivablePayableReportController::class, 'index'])
        ->name('reports.receivable-payable');

    // All Received Payment Report  

    Route::get('/reports/all-received-payment', [AllReceivedPaymentReportController::class, 'index'])->name('reports.all-received-payment');

    // Route::get('/reports/all-received-payment/filter', function () {
    //     return Inertia::render('reports/AllReceivedPaymentFilter');
    // })->name('reports.all-received-payment.filter');
    Route::get('/reports/all-received-payment/filter', [AllReceivedPaymentReportController::class, 'filter'])
        ->name('reports.all-received-payment.filter');

    //Profit Loss
    /* filter form */
    Route::get(
        '/reports/profit-loss/filter',
        [ProfitLossController::class, 'filter']
    )->name('reports.profit-loss.filter');

    /* main report */
    Route::get(
        '/reports/profit-loss',
        [ProfitLossController::class, 'index']
    )->name('reports.profit-loss');

    /* (optional) stub routes for PDF / Excel */
    Route::get('reports/profit-loss/pdf', [ProfitLossController::class, 'pdf'])->name('reports.profit-loss.pdf');
    Route::get('reports/profit-loss/excel', [ProfitLossController::class, 'excel'])->name('reports.profit-loss.excel');

    // Balance Sheet report
    Route::get('reports/balance-sheet/filter', [BalanceSheetController::class, 'filter'])
        ->name('reports.balance-sheet.filter');

    Route::get('reports/balance-sheet', [BalanceSheetController::class, 'index'])
        ->name('reports.balance-sheet');

    Route::get('reports/balance-sheet/pdf', [BalanceSheetController::class, 'pdf'])
        ->name('reports.balance-sheet.pdf');

    Route::get('reports/balance-sheet/excel', [BalanceSheetController::class, 'excel'])
        ->name('reports.balance-sheet.excel');

    // Party Stock api
    Route::get('/api/parties/{party}/items', [PartyItemController::class, 'index'])
        ->name('party.items');

    // Party Stock
    Route::prefix('party-stock')->group(function () {
        /* ───── Deposit ───── */
        Route::get('deposit', [PartyStockMoveController::class, 'create'])->name('party-stock.deposit.create');
        Route::post('deposit', [PartyStockMoveController::class, 'store'])->name('party-stock.deposit.store');
        Route::get('deposit-list', [PartyStockMoveController::class, 'index'])->name('party-stock.deposit.index');


        // Withdraw Routes
        Route::get('withdraw-list', [PartyStockWithdrawController::class, 'index'])->name('party-stock.withdraw.index');
        Route::get('withdraw', [PartyStockWithdrawController::class, 'create'])->name('party-stock.withdraw.create');  // Change to 'createWithdraw'
        Route::post('withdraw', [PartyStockWithdrawController::class, 'withdraw'])->name('party-stock.withdraw.store');  // Change to 'withdraw.store'

        // Transfer Routes/ Crushing
        Route::get('convert',        [PartyStockAdjustmentController::class, 'create'])->name('party-stock.transfer.create');
        Route::post('convert',       [PartyStockAdjustmentController::class, 'transfer'])->name('party-stock.transfer.store');  // Change to 'transfer.store'
        Route::get('convert-list',       [PartyStockAdjustmentController::class, 'index'])->name('party-stock.transfer.index');  // Change to 'transfer.store'
        Route::get('convert/{id}',       [PartyStockAdjustmentController::class, 'show'])->name('party-stock.transfer.show');  // Change to 'transfer.store'
        Route::get('convert/{id}/edit',      [PartyStockAdjustmentController::class, 'edit'])->name('party-stock.transfer.edit');
        Route::put('convert/{id}',           [PartyStockAdjustmentController::class, 'update'])->name('party-stock.transfer.update'); // PATCH also fine
        Route::delete('convert/{id}',           [PartyStockAdjustmentController::class, 'destroy'])->name('party-stock.transfer.destroy');
        // Route::post('/crushing/jobs/start', [PartyStockAdjustmentController::class, 'jobStart'])->name('crushing.jobs.start');
        // Route::post('/crushing/jobs/{job}/stop', [PartyStockAdjustmentController::class, 'jobStop'])->name('crushing.jobs.stop');

        Route::get('/crushing/jobs', [PartyStockAdjustmentController::class, 'jobsIndex'])
            ->name('crushing.jobs.index');
        Route::post('/crushing/jobs/start', [PartyStockAdjustmentController::class, 'jobStart'])
            ->name('crushing.jobs.start');
        Route::post('/crushing/jobs/{job}/stop', [PartyStockAdjustmentController::class, 'jobStop'])
            ->name('crushing.jobs.stop');
            Route::get('/crushing/jobs/{job}', [PartyStockAdjustmentController::class, 'jobsShow'])->name('crushing.jobs.show');

        Route::prefix('conversion-voucher')->name('conversion.voucher.')->group(function () {
            Route::get('/',             [ConversionVoucherController::class, 'index'])->name('index');
            Route::get('{voucher}',     [ConversionVoucherController::class, 'show'])->name('show');
            Route::get('{voucher}/pdf', [ConversionVoucherController::class, 'pdf'])->name('pdf');
        });


        Route::prefix('rent-voucher')->name('party-stock.rent-voucher.')->group(function () {
            Route::get('create', [RentVoucherController::class, 'create'])->name('create');
            Route::post('/',      [RentVoucherController::class, 'store'])->name('store');
            Route::get('/',       [RentVoucherController::class, 'index'])->name('index');
            Route::get('{voucher}', [RentVoucherController::class, 'show'])->name('show');
            Route::get('{voucher}/edit', [RentVoucherController::class, 'edit'])->name('edit');
            Route::put('{voucher}',      [RentVoucherController::class, 'update'])->name('update');
        });
    });

    // salary owed
    Route::prefix('salary-owed')
        ->name('salary-owed.')
        ->group(function () {
            Route::get('/',          [SalaryOwedController::class, 'index'])->name('index');
            Route::get('{employee}', [SalaryOwedController::class, 'show'])->name('show');
        });

    // routes/web.php
    Route::prefix('dues')->middleware('auth')->group(function () {

        /** list all invoices with money outstanding */
        Route::get('/',  [DueController::class, 'index'])->name('dues.index');
        Route::get('/settled',         [DueController::class, 'settled'])->name('dues.settled');

        /** open “Receive Payment” modal / page for a single sale  */
        Route::get('/{sale}', [DueController::class, 'show'])->name('dues.show');

        /** post a new instalment (hits SalePaymentService) */
        Route::post('/{sale}/pay', [DueController::class, 'store'])->name('dues.pay');
    });


    // routes/web.php (crushing module)
    Route::get('crushing/party-stock-report', [PartyStockReportController::class, 'index'])
        ->name('crushing.party-stock-report.index');

    Route::get('/crushing/rent-day-book', [\App\Http\Controllers\DayBookController::class, 'index'])
        ->name('reports.daybook');

    // Route::prefix('party-stock')->group(function () {
    //     Route::get('/available-stock/{partyId}', [PartyStockController::class, 'getAvailableStock']);
    //     Route::get('/party-godowns/{partyId}', [PartyStockController::class, 'getPartyGodowns']);
    // });

    // Dryer
    Route::resource('dryers', DryerController::class);

    //Stock adding to inventory
    Route::get('stock-moves',            [StockMoveController::class, 'index']);
    Route::get('stock-moves/create',     [StockMoveController::class, 'create']);
    Route::post('stock-moves',            [StockMoveController::class, 'store']);
});
//stock report pdf and excel
Route::get('/reports/stock-summary/pdf', [ReportController::class, 'stockSummaryPDF'])
    ->name('reports.stock-summary.pdf');
Route::get('/reports/stock-summary/excel', [ReportController::class, 'stockSummaryExcel'])
    ->name('reports.stock-summary.excel');
Route::get('reports/stock-summary/category-wise/pdf', [ReportController::class, 'categoryWiseStockSummaryPDF'])->name('reports.stock-summary.category-wise.pdf');
Route::get('reports/stock-summary/category-wise/excel', [ReportController::class, 'categoryWiseStockSummaryExcel'])->name('reports.stock-summary.category-wise.excel');
Route::get('reports/stock-summary/item-wise/pdf', [ReportController::class, 'itemWiseStockSummaryPDF'])->name('reports.stock-summary.item-wise.pdf');
Route::get('reports/stock-summary/item-wise/excel', [ReportController::class, 'itemWiseStockSummaryExcel'])->name('reports.stock-summary.item-wise.excel');

// Day Book Report pdf and excel
Route::prefix('reports')->name('reports.')->group(function () {
    // Route::get('day-book', [ReportController::class, 'dayBook'])->name('day-book');
    Route::get('day-book/pdf', [ReportController::class, 'dayBookPdf'])->name('day-book.pdf');
    Route::get('day-book/excel', [ReportController::class, 'dayBookExcel'])->name('day-book.excel');
});

// Account Book Report pdf and excel
Route::get('/reports/account-book/export/excel', [ReportController::class, 'exportAccountBookExcel'])->name('reports.account-book.excel');
Route::get('/reports/account-book/export/pdf', [ReportController::class, 'exportAccountBookPDF'])->name('reports.account-book.pdf');

// Account Group Summary Report pdf and excel 
Route::get('/reports/ledger-group-summary/excel', [LedgerGroupReportController::class, 'exportExcel'])->name('reports.ledger-group-summary.excel');
Route::get('/reports/ledger-group-summary/pdf', [LedgerGroupReportController::class, 'exportPDF'])->name('reports.ledger-group-summary.pdf');

// All Receivable Payable Report pdf and excel
Route::get('/reports/receivable-payable/export/pdf', [AllReceivablePayableReportController::class, 'exportPdf'])->name('reports.receivable-payable.pdf');
Route::get('/reports/receivable-payable/export/excel', [AllReceivablePayableReportController::class, 'excel'])->name('reports.receivable-payable.excel');

// All Received Payment Report pdf and excel

Route::get('/reports/all-received-payment/pdf', [AllReceivedPaymentReportController::class, 'exportPdf'])
    ->name('reports.all-received-payment.pdf');

Route::get('/reports/all-received-payment/excel', [AllReceivedPaymentReportController::class, 'exportExcel'])
    ->name('reports.all-received-payment.excel');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
