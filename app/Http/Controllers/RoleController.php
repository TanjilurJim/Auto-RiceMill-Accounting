<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $roles = Role::query()
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('name', '!=', 'admin'); // Hide admin role from non-admins
            })
            ->orderBy('id', 'desc')
            ->paginate(10) // ✅ paginate here
            ->withQueryString(); // ✅ preserves filters/search across pages

        return Inertia::render('roles/index', [
            'roles' => $roles,
        ]);
    }

    public function create(Request $request)
    {
        // Get all modules (remove pagination)
        $modules = Permission::select(
            DB::raw("SUBSTRING_INDEX(name, '.', 1) AS module"),
            DB::raw("GROUP_CONCAT(id ORDER BY name SEPARATOR ',') AS permission_ids"),
            DB::raw("GROUP_CONCAT(SUBSTRING_INDEX(name, '.', -1) ORDER BY name SEPARATOR ',') AS abilities")
        )
            ->groupBy('module')
            ->orderBy('module')
            ->get(); // Get ALL modules without pagination

        // Transform data
        $formattedModules = $modules->map(function ($item) {
            return [
                'name' => $item->module,
                'permissions' => array_map(
                    function ($id, $ability) use ($item) {
                        return [
                            'id' => (int)$id,
                            'ability' => $ability,
                            'name' => $item->module . '.' . $ability
                        ];
                    },
                    explode(',', $item->permission_ids),
                    explode(',', $item->abilities)
                )
            ];
        });

        return Inertia::render('roles/create', [
            'modules' => $formattedModules, // Send all modules
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => ['required', 'unique:roles,name'],
            'permissions' => ['array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role = Role::create(['name' => $request->name]);

        // clean: cast to int, remove non-numeric
        $ids = collect($request->permissions)
            ->filter(fn($v) => is_numeric($v))
            ->map(fn($v) => (int) $v)
            ->unique()
            ->values()
            ->all();

        if ($ids) {
            $role->syncPermissions($ids);
        }

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role created and permissions assigned.');
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
