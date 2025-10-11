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
use App\Http\Controllers\AdminDashboardController;

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
use App\Http\Controllers\SmtpSettingController;
use App\Http\Controllers\LedgerGroupReportController;


use App\Http\Controllers\PartyStockDepositController;
use App\Http\Controllers\PartyStockWithdrawController;
use App\Http\Controllers\PartyStockAdjustmentController;
use App\Http\Controllers\AllReceivedPaymentReportController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\AllReceivablePayableReportController;

if (! function_exists('perm')) {
    function perm(string $m, string $a)
    {
        return "permission:$m.$a";
    }
}

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

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/smtp', [SmtpSettingController::class, 'index'])->name('smtp.index');
    Route::post('/smtp', [SmtpSettingController::class, 'store'])->name('smtp.store');
    Route::post('/smtp/test', [SmtpSettingController::class, 'test'])->name('smtp.test');
});


Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard - open to all verified users
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    });



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


    // account-groups  (make sure you seeded 'account-groups' module)
    Route::resource('account-groups', AccountGroupController::class)->only(['index',])
        ->middleware(perm('account-groups', 'view'));
    Route::resource('account-groups', AccountGroupController::class)->only(['create', 'store'])
        ->middleware(perm('account-groups', 'create'));
    Route::resource('account-groups', AccountGroupController::class)->only(['edit', 'update'])
        ->middleware(perm('account-groups', 'edit'));
    Route::resource('account-groups', AccountGroupController::class)->only(['destroy'])
        ->middleware(perm('account-groups', 'delete'));
    Route::resource('account-groups', AccountGroupController::class)->only(['show',])
        ->middleware(perm('account-groups', 'view'));

    //api
    Route::get('/account-ledgers/{ledger}/balance', function (AccountLedger $ledger) {
        // if closing_balance is null, fall back to opening_balance
        return response()->json([
            'closing_balance' => $ledger->closing_balance ?? $ledger->opening_balance ?? 0,
            'debit_credit'    => $ledger->debit_credit      // we may use this later
        ]);
    })->name('account-ledgers.balance');

    Route::post('/account-ledgers/modal', [\App\Http\Controllers\AccountLedgerController::class, 'storeFromModal']);

    // account ledgers
    Route::resource('account-ledgers', AccountLedgerController::class)->only(['index',])
        ->middleware(perm('account-ledger', 'view'));
    Route::resource('account-ledgers', AccountLedgerController::class)->only(['create', 'store'])
        ->middleware(perm('account-ledger', 'create'));
    Route::resource('account-ledgers', AccountLedgerController::class)->only(['edit', 'update'])
        ->middleware(perm('account-ledger', 'edit'));
    Route::resource('account-ledgers', AccountLedgerController::class)->only(['destroy'])
        ->middleware(perm('account-ledger', 'delete'));

    Route::get('/account-ledgers/{id}/balance', [AccountLedgerController::class, 'balance']);

    /* =========================
|  SALESMEN / GODOWNS
|=========================*/


    // salesmen  (seeder module: 'salesman')
    Route::resource('salesmen', SalesManController::class)->only(['index',])
        ->middleware(perm('salesman', 'view'));
    Route::resource('salesmen', SalesManController::class)->only(['create', 'store'])
        ->middleware(perm('salesman', 'create'));
    Route::resource('salesmen', SalesManController::class)->only(['edit', 'update'])
        ->middleware(perm('salesman', 'edit'));
    Route::resource('salesmen', SalesManController::class)->only(['destroy'])
        ->middleware(perm('salesman', 'delete'));

    // godowns
    Route::resource('godowns', GodownController::class)->only(['index',])
        ->middleware(perm('godowns', 'view'));
    Route::resource('godowns', GodownController::class)->only(['create', 'store'])
        ->middleware(perm('godowns', 'create'));
    Route::resource('godowns', GodownController::class)->only(['edit', 'update'])
        ->middleware(perm('godowns', 'edit'));
    Route::resource('godowns', GodownController::class)->only(['destroy'])
        ->middleware(perm('godowns', 'delete'));

    // item lot shoho pick korar jonno
    Route::get(
        'godowns/{godown}/stocks-with-lots',
        [SaleController::class, 'stocksWithLots']
    )
        ->name('godown.stocks-with-lots');

    /* =========================
|  UNITS / CATEGORIES / ITEMS
|  (seeder uses 'unit' singular, 'categories', 'items')
|=========================*/


    Route::resource('units', UnitController::class)->only(['index', 'show'])
        ->middleware(perm('unit', 'view'));
    Route::resource('units', UnitController::class)->only(['create', 'store'])
        ->middleware(perm('unit', 'create'));
    Route::resource('units', UnitController::class)->only(['edit', 'update'])
        ->middleware(perm('unit', 'edit'));
    Route::resource('units', UnitController::class)->only(['destroy'])
        ->middleware(perm('unit', 'delete'));

    Route::resource('categories', CategoryController::class)->only(['index', 'show'])
        ->middleware(perm('categories', 'view'));
    Route::resource('categories', CategoryController::class)->only(['create', 'store'])
        ->middleware(perm('categories', 'create'));
    Route::resource('categories', CategoryController::class)->only(['edit', 'update'])
        ->middleware(perm('categories', 'edit'));
    Route::resource('categories', CategoryController::class)->only(['destroy'])
        ->middleware(perm('categories', 'delete'));

    Route::resource('items', ItemController::class)->only(['index',])
        ->middleware(perm('items', 'view'));
    Route::resource('items', ItemController::class)->only(['create', 'store'])
        ->middleware(perm('items', 'create'));
    Route::resource('items', ItemController::class)->only(['show',])
        ->middleware(perm('items', 'view'));
    Route::resource('items', ItemController::class)->only(['edit', 'update'])
        ->middleware(perm('items', 'edit'));
    Route::resource('items', ItemController::class)->only(['destroy'])
        ->middleware(perm('items', 'delete'));

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
    // Purchase Routes
    // ---------------------------
    Route::resource('purchases', PurchaseController::class)->only(['index'])
        ->middleware(perm('purchases', 'view'));
    Route::resource('purchases', PurchaseController::class)->only(['create', 'store'])
        ->middleware(perm('purchases', 'create'));
    Route::resource('purchases', PurchaseController::class)->only(['edit', 'update'])
        ->middleware(perm('purchases', 'edit'));
    Route::resource('purchases', PurchaseController::class)->only(['destroy'])
        ->middleware(perm('purchases', 'delete'));
    Route::resource('purchases', PurchaseController::class)->only(['show'])
        ->middleware(perm('purchases', 'view'));

    // Purchase returns (seeder key: 'purchases-return')
    Route::get('purchase-returns/{purchase_return}/invoice', [PurchaseReturnController::class, 'invoice'])
        ->middleware(perm('purchases-return', 'view'))->name('purchase-returns.invoice');

    Route::resource('purchase-returns', PurchaseReturnController::class)->only(['index',])
        ->middleware(perm('purchases-return', 'view'));
    Route::resource('purchase-returns', PurchaseReturnController::class)->only(['create', 'store'])
        ->middleware(perm('purchases-return', 'create'));
    Route::resource('purchase-returns', PurchaseReturnController::class)->only(['edit', 'update'])
        ->middleware(perm('purchases-return', 'edit'));
    Route::resource('purchase-returns', PurchaseReturnController::class)->only(['destroy'])
        ->middleware(perm('purchases-return', 'delete'));


    Route::get('/sales/inbox/sub',  [SaleController::class, 'inboxSub'])->name('sales.inbox.sub');
    Route::get('/sales/inbox/resp', [SaleController::class, 'inboxResp'])->name('sales.inbox.resp');
    Route::get('/sales/approvals', [SaleApprovalController::class, 'index'])
        ->name('sales.approvals');


    // existing approve / reject posts
    Route::post('/sales/{sale}/approve-sub',   [SaleController::class, 'approveSub'])->name('sales.approve.sub');
    Route::post('/sales/{sale}/approve-final', [SaleController::class, 'approveFinal'])->name('sales.approve.final');
    Route::post('/sales/{sale}/reject',        [SaleController::class, 'reject'])->name('sales.reject');

    Route::get('purchase-returns/{purchase_return}/invoice', [PurchaseReturnController::class, 'invoice'])->name('purchase-returns.invoice');

    // Sale Routes
    Route::resource('sales', SaleController::class)->only(['index',])
        ->middleware(perm('sales', 'view'));
    Route::resource('sales', SaleController::class)->only(['create', 'store'])
        ->middleware(perm('sales', 'create'));
    Route::resource('sales', SaleController::class)->only(['edit', 'update'])
        ->middleware(perm('sales', 'edit'));
    Route::resource('sales', SaleController::class)->only(['destroy'])
        ->middleware(perm('sales', 'delete'));
    Route::resource('sales', SaleController::class)->only(['show'])
        ->middleware(perm('sales', 'view'));


    // api routes for supplier/web.php
    Route::get('/api/suppliers/{ledger}/dues', [\App\Http\Controllers\PaymentAddController::class, 'supplierDues'])
        ->name('suppliers.dues');

    // Sales document previews (read)
    Route::prefix('sales')->name('sales.')->middleware('permission:sales.view')->group(function () {
        Route::get('{sale}/invoice', [SaleController::class, 'invoice'])->name('invoice');
        Route::get('{sale}/truck-chalan', [SaleController::class, 'truckChalan'])->name('truck-chalan');
        Route::get('{sale}/load-slip', [SaleController::class, 'loadSlip'])->name('load-slip');
        Route::get('{sale}/gate-pass', [SaleController::class, 'gatePass'])->name('gate-pass');
    });

    // sale responsible
    // 👇 approval inboxes

    Route::resource('salary-receives', SalaryReceiveController::class)->parameters([
        'salary-receives' => 'salaryReceive',
    ]);
    //Sales Return
    Route::resource('sales-returns', SalesReturnController::class)->only(['index',])
        ->middleware(perm('sales-return', 'view'));
    Route::resource('sales-returns', SalesReturnController::class)->only(['create', 'store'])
        ->middleware(perm('sales-return', 'create'));
    Route::resource('sales-returns', SalesReturnController::class)->only(['edit', 'update'])
        ->middleware(perm('sales-return', 'edit'));
    Route::resource('sales-returns', SalesReturnController::class)->only(['destroy'])
        ->middleware(perm('sales-return', 'delete'));
    Route::resource('sales-returns', SalesReturnController::class)->only(['show',])
        ->middleware(perm('sales-return', 'view'));



    Route::get('/sales/{sale}/load', [SalesReturnController::class, 'loadSale']);
    Route::get('/sales-returns/{salesReturn}/invoice', [SalesReturnController::class, 'invoice'])->name('sales-returns.invoice');
    Route::resource('sales-orders', SalesOrderController::class);
    Route::get('/sales-orders/products/by-godown/{id}', [SalesOrderController::class, 'getProductsByGodown']);
    Route::get('/sales-orders/{salesOrder}/invoice', [SalesOrderController::class, 'invoice'])->name('sales-orders.invoice');
    Route::get('/sales/items/by-godown/{id}', [SaleController::class, 'getItemsByGodown']);



    // received modes
    Route::resource('received-modes', ReceivedModeController::class)->only(['index',])
        ->middleware(perm('received-modes', 'view'));
    Route::resource('received-modes', ReceivedModeController::class)->only(['create', 'store'])
        ->middleware(perm('received-modes', 'create'));
    Route::resource('received-modes', ReceivedModeController::class)->only(['edit', 'update'])
        ->middleware(perm('received-modes', 'edit'));
    Route::resource('received-modes', ReceivedModeController::class)->only(['destroy'])
        ->middleware(perm('received-modes', 'delete'));
    Route::resource('received-modes', ReceivedModeController::class)->only(['show',])
        ->middleware(perm('received-modes', 'view'));

    Route::resource('received-add', ReceivedAddController::class)->only(['index',])
        ->middleware(perm('received-add', 'view'));
    Route::resource('received-add', ReceivedAddController::class)->only(['create', 'store'])
        ->middleware(perm('received-add', 'create'));
    Route::resource('received-add', ReceivedAddController::class)->only(['edit', 'update'])
        ->middleware(perm('received-add', 'edit'));
    Route::resource('received-add', ReceivedAddController::class)->only(['destroy'])
        ->middleware(perm('received-add', 'delete'));
    Route::resource('received-add', ReceivedAddController::class)->only(['show',])
        ->middleware(perm('received-add', 'view'));

    // routes/web.php
    Route::post('/items/modal', [\App\Http\Controllers\ItemController::class, 'storeFromModal'])
        ->name('items.storeFromModal');


    Route::get('/received-add/{receivedAdd}/print', [ReceivedAddController::class, 'print'])->name('received-add.print');


    Route::resource('payment-add', PaymentAddController::class)->only(['index',])
        ->middleware(perm('payment-add', 'view'));
    Route::resource('payment-add', PaymentAddController::class)->only(['create', 'store'])
        ->middleware(perm('payment-add', 'create'));
    Route::resource('payment-add', PaymentAddController::class)->only(['edit', 'update'])
        ->middleware(perm('payment-add', 'edit'));
    Route::resource('payment-add', PaymentAddController::class)->only(['destroy'])
        ->middleware(perm('payment-add', 'delete'));
    Route::resource('payment-add', PaymentAddController::class)->only(['show',])
        ->middleware(perm('payment-add', 'view'));

    Route::get('/payment-add/{paymentAdd}/print', [PaymentAddController::class, 'print'])->name('payment-add.print');


    Route::get('/purchases/{purchase}/payments/create', [PaymentAddController::class, 'createForPurchase'])
        ->name('purchase.payments.create');
    Route::post('/purchases/{purchase}/payments', [PaymentAddController::class, 'storeForPurchase'])
        ->name('purchase.payments.store');

    /* =========================
|  SETTINGS / FINANCIAL YEAR
|=========================*/


    Route::get('company-settings', [CompanySettingController::class, 'edit'])
        ->middleware(perm('company-settings', 'edit'))->name('company-settings.edit');
    Route::put('company-settings', [CompanySettingController::class, 'update'])
        ->middleware(perm('company-settings', 'edit'))->name('company-settings.update');
    Route::get('company-settings/costings', [CompanySettingController::class, 'editCostings'])
        ->middleware(perm('company-settings', 'edit'))->name('company-settings.costings.edit');
    Route::put('company-settings/costings', [CompanySettingController::class, 'updateCostings'])
        ->middleware(perm('company-settings', 'edit'))->name('company-settings.costings.update');


    Route::resource('financial-years', FinancialYearController::class)->only(['index',])
        ->middleware(perm('financial-year', 'view'));
    Route::resource('financial-years', FinancialYearController::class)->only(['create', 'store'])
        ->middleware(perm('financial-year', 'create'));
    Route::resource('financial-years', FinancialYearController::class)->only(['edit', 'update'])
        ->middleware(perm('financial-year', 'edit'));
    Route::resource('financial-years', FinancialYearController::class)->only(['destroy'])
        ->middleware(perm('financial-year', 'delete'));
    Route::resource('financial-years', FinancialYearController::class)->only(['show',])
        ->middleware(perm('financial-year', 'view'));


    Route::get('/payment-add/{voucher_no}/print', [PaymentAddController::class, 'print'])->name('payment-add.print');
    /* =========================
|  CONTRA / JOURNAL
|=========================*/

    Route::resource('contra-add', ContraAddController::class)->only(['index',])
        ->middleware(perm('contra-add', 'view'));
    Route::resource('contra-add', ContraAddController::class)->only(['create', 'store'])
        ->middleware(perm('contra-add', 'create'));
    Route::resource('contra-add', ContraAddController::class)->only(['edit', 'update'])
        ->middleware(perm('contra-add', 'edit'));
    Route::resource('contra-add', ContraAddController::class)->only(['destroy'])
        ->middleware(perm('contra-add', 'delete'));
    Route::resource('contra-add', ContraAddController::class)->only(['show',])
        ->middleware(perm('contra-add', 'view'));

    Route::get('/contra-add/{voucher}/print', [ContraAddController::class, 'print'])->name('contra-add.print');


    Route::resource('journal-add', JournalAddController::class)->only(['index',])
        ->middleware(perm('journal-add', 'view'));
    Route::resource('journal-add', JournalAddController::class)->only(['create', 'store'])
        ->middleware(perm('journal-add', 'create'));
    Route::resource('journal-add', JournalAddController::class)->only(['edit', 'update'])
        ->middleware(perm('journal-add', 'edit'));
    Route::resource('journal-add', JournalAddController::class)->only(['destroy'])
        ->middleware(perm('journal-add', 'delete'));
    Route::resource('journal-add', JournalAddController::class)->only(['show',])
        ->middleware(perm('journal-add', 'view'));

    Route::get('/journal-add/{voucher_no}/print', [JournalAddController::class, 'print'])->name('journal-add.print');

    /* =========================
|  STOCK TRANSFER / PRODUCTION
|=========================*/

    Route::resource('stock-transfers', StockTransferController::class)->only(['index',])
        ->middleware(perm('stock-transfer', 'view'));
    Route::resource('stock-transfers', StockTransferController::class)->only(['create', 'store'])
        ->middleware(perm('stock-transfer', 'create'));
    Route::resource('stock-transfers', StockTransferController::class)->only(['edit', 'update'])
        ->middleware(perm('stock-transfer', 'edit'));
    Route::resource('stock-transfers', StockTransferController::class)->only(['destroy'])
        ->middleware(perm('stock-transfer', 'delete'));
    Route::resource('stock-transfers', StockTransferController::class)->only(['show',])
        ->middleware(perm('stock-transfer', 'view'));

    Route::resource('working-orders', ProductionController::class)->only(['index',])
        ->middleware(perm('working-orders', 'view'));
    Route::resource('working-orders', ProductionController::class)->only(['create', 'store'])
        ->middleware(perm('working-orders', 'create'));
    Route::resource('working-orders', ProductionController::class)->only(['edit', 'update'])
        ->middleware(perm('working-orders', 'edit'));
    Route::resource('working-orders', ProductionController::class)->only(['destroy'])
        ->middleware(perm('working-orders', 'delete'));
    Route::resource('working-orders', ProductionController::class)->only(['show',])
        ->middleware(perm('working-orders', 'view'));


    Route::post('/production/{id}/mark-as-produced', [ProductionController::class, 'markAsProduced'])->name('production.markAsProduced');

    // finished-products

    Route::resource('finished-products', FinishedProductController::class)->only(['index',])
        ->middleware(perm('finished-products', 'view'));
    Route::resource('finished-products', FinishedProductController::class)->only(['create', 'store'])
        ->middleware(perm('finished-products', 'create'));
    Route::resource('finished-products', FinishedProductController::class)->only(['edit', 'update'])
        ->middleware(perm('finished-products', 'edit'));
    Route::resource('finished-products', FinishedProductController::class)->only(['destroy'])
        ->middleware(perm('finished-products', 'delete'));
    Route::resource('finished-products', FinishedProductController::class)->only(['show',])
        ->middleware(perm('finished-products', 'view'));

    Route::get(
        'finished-products/{id}/print',
        [FinishedProductController::class, 'print']
    )->name('finished-products.print');


    // Tawhid Add

    // departments
    Route::resource('departments', DepartmentController::class)->only(['index',])
        ->middleware(perm('departments', 'view'));
    Route::resource('departments', DepartmentController::class)->only(['create', 'store'])
        ->middleware(perm('departments', 'create'));
    Route::resource('departments', DepartmentController::class)->only(['edit', 'update'])
        ->middleware(perm('departments', 'edit'));
    Route::resource('departments', DepartmentController::class)->only(['destroy'])
        ->middleware(perm('departments', 'delete'));
    Route::resource('departments', DepartmentController::class)->only(['show',])
        ->middleware(perm('departments', 'view'));


    Route::get('/users/{user}/lineage', [UserController::class, 'lineage'])
        ->name('users.lineage');
    Route::patch('/users/{user}/extend-trial', [UserController::class, 'extendTrial'])
        ->name('users.extendTrial');

    // designations
    Route::resource('designations', DesignationController::class)->only(['index',])
        ->middleware(perm('designations', 'view'));
    Route::resource('designations', DesignationController::class)->only(['create', 'store'])
        ->middleware(perm('designations', 'create'));
    Route::resource('designations', DesignationController::class)->only(['edit', 'update'])
        ->middleware(perm('designations', 'edit'));
    Route::resource('designations', DesignationController::class)->only(['destroy'])
        ->middleware(perm('designations', 'delete'));
    Route::resource('designations', DesignationController::class)->only(['show',])
        ->middleware(perm('designations', 'view'));

    // shifts
    Route::resource('shifts', ShiftController::class)->only(['index',])
        ->middleware(perm('shifts', 'view'));
    Route::resource('shifts', ShiftController::class)->only(['create', 'store'])
        ->middleware(perm('shifts', 'create'));
    Route::resource('shifts', ShiftController::class)->only(['edit', 'update'])
        ->middleware(perm('shifts', 'edit'));
    Route::resource('shifts', ShiftController::class)->only(['destroy'])
        ->middleware(perm('shifts', 'delete'));
    Route::resource('shifts', ShiftController::class)->only(['show',])
        ->middleware(perm('shifts', 'view'));
    // employees
    Route::resource('employees', EmployeeController::class)->only(['index',])
        ->middleware(perm('employees', 'view'));
    Route::resource('employees', EmployeeController::class)->only(['create', 'store'])
        ->middleware(perm('employees', 'create'));
    Route::resource('employees', EmployeeController::class)->only(['edit', 'update'])
        ->middleware(perm('employees', 'edit'));
    Route::resource('employees', EmployeeController::class)->only(['destroy'])
        ->middleware(perm('employees', 'delete'));
    Route::resource('employees', EmployeeController::class)->only(['show',])
        ->middleware(perm('employees', 'view'));

    // salary-slips
    Route::resource('salary-slips', SalarySlipController::class)->only(['index',])
        ->middleware(perm('salary-slips', 'view'));
    Route::resource('salary-slips', SalarySlipController::class)->only(['create', 'store'])
        ->middleware(perm('salary-slips', 'create'));
    Route::resource('salary-slips', SalarySlipController::class)->only(['edit', 'update'])
        ->middleware(perm('salary-slips', 'edit'));
    Route::resource('salary-slips', SalarySlipController::class)->only(['destroy'])
        ->middleware(perm('salary-slips', 'delete'));

    Route::resource('salary-slips', SalarySlipController::class)->only(['show',])
        ->middleware(perm('salary-slips', 'view'));
    // employee salary report
    Route::get(
        'employees/{employee}/salary-report',
        [EmployeeController::class, 'salaryReport']
    )->name('employees.salary-report');





    // Salary

    Route::get('/salary-slips/{salarySlip}/invoice', [SalarySlipController::class, 'invoice'])->name('salary-slips.invoice');

    /* =========================
|  Employee Reports
|=========================*/

    Route::get('employee-ledger', [ReportController::class, 'employeeLedger'])
        ->middleware(perm('employee-ledger', 'view'))
        ->name('employee.ledger');

    Route::prefix('employee-reports')->name('employee-reports.')->group(function () {
        Route::get('/', [\App\Http\Controllers\EmployeeReportController::class, 'index'])
            ->middleware(perm('employee-reports', 'view'))
            ->name('index');
    });

    /* =========================
|  Stock Reports & Day Book
|=========================*/

    Route::get('/reports/stock-summary', [ReportController::class, 'stockSummary'])
        ->middleware(perm('stock-reports', 'view'))->name('reports.stock-summary');
    Route::get('/reports/stock-summary/category-wise', [ReportController::class, 'categoryWiseStockSummary'])
        ->middleware(perm('stock-reports', 'view'))->name('reports.stock-summary.category-wise');
    Route::get('/reports/stock-summary/item-wise', [ReportController::class, 'itemWiseStockSummary'])
        ->middleware(perm('stock-reports', 'view'))->name('reports.stock-summary.item-wise');

    Route::get('/reports/day-book', [ReportController::class, 'dayBook'])
        ->middleware(perm('daybook-report', 'view'))->name('reports.day-book');

    /* =========================
|  Account Book & Ledger Group Summary
|=========================*/

    Route::get('/reports/account-book', [ReportController::class, 'accountBook'])
        ->middleware(perm('account-book-report', 'view'))->name('reports.account-book');

    Route::get('/reports/ledger-group-summary/filter', [LedgerGroupReportController::class, 'filter'])
        ->middleware(perm('ledger-group-summary', 'view'))->name('reports.ledger-group-summary.filter');
    Route::get('/reports/ledger-group-summary', [LedgerGroupReportController::class, 'index'])
        ->middleware(perm('ledger-group-summary', 'view'))->name('reports.ledger-group-summary');

    // Purchase Report
    Route::redirect('/reports/purchase', '/reports/purchase/filter');


    Route::prefix('reports/purchase')->name('reports.purchase.')->group(function () {
        Route::get('filter/{tab?}', [PurchaseReportController::class, 'filter'])
            ->middleware(perm('purchase-report', 'view'))
            ->where('tab', 'category|item|party|return|all')
            ->name('filter');
        Route::get('{tab}', [PurchaseReportController::class, 'index'])
            ->middleware(perm('purchase-report', 'view'))
            ->where('tab', 'category|item|party|return|all')
            ->name('index');
        Route::get('{tab}/export', [PurchaseReportController::class, 'export'])
            ->middleware(perm('purchase-report', 'export'))
            ->where('tab', 'category|item|party|return|all')
            ->name('export');
    });

    // Sales Report

    Route::redirect('/reports/sale', '/reports/sale/filter');

    /* =========================
|  Sales Reports
|=========================*/


    Route::prefix('reports/sale')->name('reports.sale.')->group(function () {
        Route::get('filter/{tab?}', [\App\Http\Controllers\SaleReportController::class, 'filter'])
            ->middleware(perm('sale-report', 'view'))
            ->where('tab', 'category|item|party|godown|salesman|all|return')
            ->name('filter');

        Route::get('{tab}', [\App\Http\Controllers\SaleReportController::class, 'index'])
            ->middleware(perm('sale-report', 'view'))
            ->where('tab', 'category|item|party|godown|salesman|all|return')
            ->name('index');

        Route::get('{tab}/export', [\App\Http\Controllers\SaleReportController::class, 'export'])
            ->middleware(perm('sale-report', 'export'))
            ->where('tab', 'category|item|party|godown|salesman|all|return')
            ->name('export');
    });


    /* =========================
|  Receivable/Payable & Received Payment Reports
|=========================*/

    Route::get('/reports/receivable-payable/filter', [AllReceivablePayableReportController::class, 'filter'])
        ->middleware(perm('receivable-payable-report', 'view'))->name('reports.receivable-payable.filter');

    Route::get('/reports/receivable-payable', [AllReceivablePayableReportController::class, 'index'])
        ->middleware(perm('receivable-payable-report', 'view'))->name('reports.receivable-payable');

    Route::get('/reports/all-received-payment', [AllReceivedPaymentReportController::class, 'index'])
        ->middleware(perm('receive-payment-report', 'view'))->name('reports.all-received-payment');

    Route::get('/reports/all-received-payment/filter', [AllReceivedPaymentReportController::class, 'filter'])
        ->middleware(perm('receive-payment-report', 'view'))->name('reports.all-received-payment.filter');

    //Profit Loss
    /* filter form */


    Route::get('/reports/profit-loss/filter', [ProfitLossController::class, 'filter'])
        ->middleware(perm('profit-loss-report', 'view'))->name('reports.profit-loss.filter');

    Route::get('/reports/profit-loss', [ProfitLossController::class, 'index'])
        ->middleware(perm('profit-loss-report', 'view'))->name('reports.profit-loss');

    /* (optional) stub routes for PDF / Excel */
    Route::get('reports/profit-loss/pdf', [ProfitLossController::class, 'pdf'])->name('reports.profit-loss.pdf');
    Route::get('reports/profit-loss/excel', [ProfitLossController::class, 'excel'])->name('reports.profit-loss.excel');



    Route::get('reports/balance-sheet/filter', [BalanceSheetController::class, 'filter'])
        ->middleware(perm('balance-sheet-report', 'view'))->name('reports.balance-sheet.filter');

    Route::get('reports/balance-sheet', [BalanceSheetController::class, 'index'])
        ->middleware(perm('balance-sheet-report', 'view'))->name('reports.balance-sheet');

    Route::get('reports/balance-sheet/pdf', [BalanceSheetController::class, 'pdf'])
        ->name('reports.balance-sheet.pdf');

    Route::get('reports/balance-sheet/excel', [BalanceSheetController::class, 'excel'])
        ->name('reports.balance-sheet.excel');

    // Party Stock api
    Route::get('/api/parties/{party}/items', [PartyItemController::class, 'index'])
        ->name('party.items');

    // Party Stock

    // Party stock flows
    Route::prefix('party-stock')->group(function () {
        // Deposit
        Route::get('deposit', [PartyStockMoveController::class, 'create'])
            ->middleware(perm('crushing-party-stock', 'create'))->name('party-stock.deposit.create');
        Route::post('deposit', [PartyStockMoveController::class, 'store'])
            ->middleware(perm('crushing-party-stock', 'create'))->name('party-stock.deposit.store');
        Route::get('deposit-list', [PartyStockMoveController::class, 'index'])
            ->middleware(perm('crushing-party-stock', 'view'))->name('party-stock.deposit.index');

        Route::get('deposit/{id}/edit', [PartyStockMoveController::class, 'edit'])
            ->middleware(perm('crushing-party-stock', 'create'))
            ->name('party-stock.deposit.edit');

        Route::put('deposit/{id}', [PartyStockMoveController::class, 'update'])
            ->middleware(perm('crushing-party-stock', 'create'))
            ->name('party-stock.deposit.update');

        // DESTROY
        Route::delete('deposit/{id}', [PartyStockMoveController::class, 'destroy'])
            ->middleware(perm('crushing-party-stock', 'delete'))
            ->name('party-stock.deposit.destroy');

        Route::get('/party-stock/deposits/{id}', [\App\Http\Controllers\PartyStockMoveController::class, 'show'])
            ->middleware(perm('crushing-party-stock', 'view'))->name('party-stock.deposit.show');

        // Withdraw
        Route::get('withdraw-list', [PartyStockWithdrawController::class, 'index'])
            ->middleware(perm('crushing-party-withdraw', 'view'))->name('party-stock.withdraw.index');
        Route::get('withdraw', [PartyStockWithdrawController::class, 'create'])
            ->middleware(perm('crushing-party-withdraw', 'create'))->name('party-stock.withdraw.create');
        Route::post('withdraw', [PartyStockWithdrawController::class, 'withdraw'])
            ->middleware(perm('crushing-party-withdraw', 'create'))->name('party-stock.withdraw.store');

        // Convert / Transfer (Crushing)
        Route::get('convert', [PartyStockAdjustmentController::class, 'create'])
            ->middleware(perm('crushing-party-convert', 'create'))->name('party-stock.transfer.create');

        Route::post('/crushing/compute-paddy-total', [\App\Http\Controllers\PartyStockAdjustmentController::class, 'computePaddyTotal'])
            ->middleware(perm('crushing-party-convert', 'create'))->name('crushing.compute-paddy-total');

        Route::get('/company/convert-list', [PartyStockAdjustmentController::class, 'companyIndex'])
            ->middleware(perm('crushing-party-convert', 'view'))->name('company-conversions.index');
        Route::get('/company-conversions/{id}', [\App\Http\Controllers\PartyStockAdjustmentController::class, 'companyShow'])
            ->middleware(perm('crushing-party-convert', 'view'))->name('company-conversions.show');

        Route::post('convert', [PartyStockAdjustmentController::class, 'transfer'])
            ->middleware(perm('crushing-party-convert', 'create'))->name('party-stock.transfer.store');
        Route::get('convert-list', [PartyStockAdjustmentController::class, 'index'])
            ->middleware(perm('crushing-party-convert', 'view'))->name('party-stock.transfer.index');
        Route::get('convert/{id}', [PartyStockAdjustmentController::class, 'show'])
            ->middleware(perm('crushing-party-convert', 'view'))->name('party-stock.transfer.show');
        Route::get('convert/{id}/edit', [PartyStockAdjustmentController::class, 'edit'])
            ->middleware(perm('crushing-party-convert', 'edit'))->name('party-stock.transfer.edit');
        Route::put('convert/{id}', [PartyStockAdjustmentController::class, 'update'])
            ->middleware(perm('crushing-party-convert', 'edit'))->name('party-stock.transfer.update');
        Route::delete('convert/{id}', [PartyStockAdjustmentController::class, 'destroy'])
            ->middleware(perm('crushing-party-convert', 'delete'))->name('party-stock.transfer.destroy');

        // Jobs (start/stop)
        Route::get('/crushing/jobs', [PartyStockAdjustmentController::class, 'jobsIndex'])
            ->middleware(perm('crushing-party-convert', 'view'))->name('crushing.jobs.index');
        Route::post('/crushing/jobs/start', [PartyStockAdjustmentController::class, 'jobStart'])
            ->middleware(perm('crushing-party-convert', 'create'))->name('crushing.jobs.start');
        Route::post('/crushing/jobs/{job}/stop', [PartyStockAdjustmentController::class, 'jobStop'])
            ->middleware(perm('crushing-party-convert', 'edit'))->name('crushing.jobs.stop');
        Route::get('/crushing/jobs/{job}', [PartyStockAdjustmentController::class, 'jobsShow'])
            ->middleware(perm('crushing-party-convert', 'view'))->name('crushing.jobs.show');

        // Company convert (into company stock)
        Route::post('convert/company', [PartyStockAdjustmentController::class, 'storeCompany'])
            ->middleware(perm('crushing-party-convert', 'create'))->name('crushing.company.convert.store');

        // Conversion voucher
        Route::prefix('conversion-voucher')->name('conversion.voucher.')->group(function () {
            Route::get('/', [ConversionVoucherController::class, 'index'])
                ->middleware(perm('crushing-voucher', 'view'))->name('index');
            Route::get('{voucher}', [ConversionVoucherController::class, 'show'])
                ->middleware(perm('crushing-voucher', 'view'))->name('show');
            Route::get('{voucher}/pdf', [ConversionVoucherController::class, 'pdf'])
                ->middleware(perm('crushing-voucher', 'pdf'))->name('pdf');
        });

        // Rent voucher (using same module; split if you prefer a new slug)
        Route::prefix('rent-voucher')->name('party-stock.rent-voucher.')->group(function () {
            Route::get('create', [RentVoucherController::class, 'create'])
                ->middleware(perm('crushing-voucher', 'create'))->name('create');
            Route::post('/', [RentVoucherController::class, 'store'])
                ->middleware(perm('crushing-voucher', 'create'))->name('store');
            Route::get('/', [RentVoucherController::class, 'index'])
                ->middleware(perm('crushing-voucher', 'view'))->name('index');
            Route::get('{voucher}', [RentVoucherController::class, 'show'])
                ->middleware(perm('crushing-voucher', 'view'))->name('show');
            Route::get('{voucher}/edit', [RentVoucherController::class, 'edit'])
                ->middleware(perm('crushing-voucher', 'edit'))->name('edit');
            Route::put('{voucher}', [RentVoucherController::class, 'update'])
                ->middleware(perm('crushing-voucher', 'edit'))->name('update');

            Route::post('{voucher}/settle', [RentVoucherController::class, 'settle'])
                ->middleware(perm('crushing-voucher', 'create')) // or 'edit' if you don't have a 'receive' ability
                ->name('settle');
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
    Route::prefix('dues')->name('dues.')->group(function () {
        Route::get('/',  [DueController::class, 'index'])
            ->middleware(perm('dues', 'view'))->name('index');

        Route::get('/settled', [DueController::class, 'settled'])
            ->middleware(perm('dues-settled', 'view'))->name('settled');

        Route::get('/{sale}', [DueController::class, 'show'])
            ->middleware(perm('dues', 'view'))->name('show');

        Route::post('/{sale}/pay', [DueController::class, 'store'])
            ->middleware(perm('dues', 'create'))->name('pay');
    });


    // Crushing party stock report page
    Route::get('crushing/party-stock-report', [PartyStockReportController::class, 'index'])
        ->middleware(perm('crushing-party-report', 'view'))->name('crushing.party-stock-report.index');

    // Crushing rent daybook
    Route::get('/crushing/rent-day-book', [\App\Http\Controllers\DayBookController::class, 'index'])
        ->middleware(perm('crushing-daybook', 'view'))->name('reports.daybook');



    // Dryer
    // Route::resource('dryers', DryerController::class)->middleware(perm('dryers', 'view'));

    Route::prefix('dryers')->name('dryers.')->group(function () {
        Route::get('/', [DryerController::class, 'index'])
            ->middleware(perm('dryers', 'view'))
            ->name('index');

        Route::get('/create', [DryerController::class, 'create'])
            ->middleware(perm('dryers', 'create'))
            ->name('create');

        Route::post('/', [DryerController::class, 'store'])
            ->middleware(perm('dryers', 'create'))
            ->name('store');

        Route::get('/{dryer}', [DryerController::class, 'show'])
            ->middleware(perm('dryers', 'view'))
            ->name('show');

        Route::get('/{dryer}/edit', [DryerController::class, 'edit'])
            ->middleware(perm('dryers', 'edit'))
            ->name('edit');

        Route::put('/{dryer}', [DryerController::class, 'update'])
            ->middleware(perm('dryers', 'edit'))
            ->name('update');

        Route::delete('/{dryer}', [DryerController::class, 'destroy'])
            ->middleware(perm('dryers', 'delete'))
            ->name('destroy');
    });

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

Route::get('/privacy-policy', function () {
    return view('privacy-policy');
})->name('privacy-policy');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
