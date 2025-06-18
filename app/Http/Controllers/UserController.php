<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->get('filter', 'all');
        $search = $request->get('search', '');

        // Include 'roles' and 'createdBy' relationships
        $query = User::with(['roles', 'createdBy']);

        if (!auth()->user()->hasRole('admin')) {
            $query->where('created_by', auth()->id());
        }

        if ($filter === 'trashed') {
            $query->onlyTrashed();
        } elseif ($filter === 'active') {
            $query->whereNull('deleted_at')->where('status', 'active');
        } elseif ($filter === 'inactive') {
            $query->whereNull('deleted_at')->where('status', 'inactive');
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // $users = $query->paginate(10)->appends(['filter' => $filter, 'search' => $search]);
        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users,
            'filter' => $filter,
            'search' => $search,
        ]);
    }

    public function show($id)
    {
        $user = \App\Models\User::with(['roles', 'createdBy'])->findOrFail($id);
        return Inertia::render('users/show', ['user' => $user]);
    }

    public function edit($id)
    {
        $user = User::with('roles')->findOrFail($id);
        // 🛡 Restrict managers from editing users outside their scope
        if (!auth()->user()->hasRole('admin') && $user->created_by !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $roles = Role::query()
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('name', '!=', 'admin');
            })
            ->get();

        $userRoles = $user->roles->pluck('id')->toArray();

        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => $roles,
            'userRoles' => $userRoles,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            'roles' => 'array'
        ]);

        $user = User::findOrFail($id);
        $authUser = auth()->user(); // The currently logged-in user

        // ❌ Prevent non-admins from editing their own roles
        if (!$authUser->hasRole('admin') && $authUser->id === $user->id) {
            abort(403, 'You cannot edit your own roles.');
        }

        // ✅ Admins can update all users, including themselves
        if ($authUser->hasRole('admin')) {
            $user->syncRoles($request->roles ?? []);
        } else {
            // ❌ Non-admins can only assign roles they have permission for
            $allowedRoles = Role::whereNotIn('name', ['admin'])->pluck('id')->toArray();
            $filteredRoles = array_intersect($request->roles ?? [], $allowedRoles);
            $user->syncRoles($filteredRoles);
        }

        // ✅ Update other user details (common for all)
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'status' => $request->status,
        ]);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }


    public function create()
    {
        $roles = Role::query()
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('name', '!=', 'admin');
            })
            ->get();

        return Inertia::render('users/create', ['roles' => $roles]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'roles' => 'array'
        ]);

        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'created_by' => auth()->id(), // ✅ set ownership
        ]);

        $user->syncRoles($request->roles ?? []);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }


    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if (!auth()->user()->hasRole('admin') && $user->created_by !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted (soft delete).');
    }

    // Restore user
    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        if (!auth()->user()->hasRole('admin') && $user->created_by !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $user->restore();

        return redirect()->route('users.index')->with('success', 'User restored successfully.');
    }

    // Permanently delete user
    public function forceDelete($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        if (!auth()->user()->hasRole('admin') && $user->created_by !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $user->forceDelete();

        return redirect()->route('users.index')->with('success', 'User permanently deleted.');
    }
}
