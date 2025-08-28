<?php

namespace App\Http\Controllers;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PurchaseReturn;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    //
    public function index() {

        return inertia::render('dashboard/AdminDashboard');
    }
}
