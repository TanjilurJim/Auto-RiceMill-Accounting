<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::query()
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('name', '!=', 'admin'); // Hide admin role from non-admins
            })
            ->get();

        return Inertia::render('roles/index', ['roles' => $roles]);
    }

    public function create()
    {
        // ✅ Non-admins can create roles
        $permissions = Permission::all();

        return Inertia::render('roles/create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        // ✅ Allow both admins and non-admins to create roles
        $request->validate([
            'name' => ['required', 'unique:roles,name'],
            'permissions' => 'array'
        ]);

        $role = Role::create(['name' => $request->name]);

        if ($request->permissions) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('roles.index')->with('success', 'Role created and permissions assigned.');
    }

    public function edit($id)
    {
        $role = Role::findOrFail($id);

        // 🛡 Prevent non-admins from editing their own role
        if (!auth()->user()->hasRole('admin') && auth()->user()->hasRole($role->name)) {
            abort(403, 'Unauthorized - You cannot edit your own role.');
        }

        $permissions = Permission::all(); // Admin and non-admins see all permissions

        $rolePermissions = $role->permissions->pluck('id')->toArray();

        return Inertia::render('roles/edit', [
            'role' => $role,
            'permissions' => $permissions,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        // 🛡 Prevent non-admins from updating their own role
        if (!auth()->user()->hasRole('admin') && auth()->user()->hasRole($role->name)) {
            abort(403, 'Unauthorized - You cannot update your own role.');
        }

        // ✅ Allow admin to edit all roles, including admin
        $request->validate([
            'name' => ['required', 'unique:roles,name,' . $id], // Removed 'not_in:admin'
            'permissions' => 'array'
        ]);

        $role->update(['name' => $request->name]);

        // Sync permissions if provided
        $role->syncPermissions($request->permissions ?? []);

        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        // 🛡 Prevent deletion of the admin role
        if ($role->name === 'admin') {
            return redirect()->route('roles.index')->with('error', 'Admin role cannot be deleted.');
        }

        // 🛡 Prevent non-admins from deleting their own role
        if (!auth()->user()->hasRole('admin') && auth()->user()->hasRole($role->name)) {
            abort(403, 'Unauthorized - You cannot delete your own role.');
        }

        $role->delete();

        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }
}
