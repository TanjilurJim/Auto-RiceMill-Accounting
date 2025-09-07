<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

use Carbon\Carbon;
use Illuminate\Support\Str;

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
        $user = \App\Models\User::query()
            ->select([
                'id',
                'name',
                'email',
                'phone',
                'address',
                'status',
                'created_at',
                'trial_ends_at',
                'created_by',
            ])
            ->with([
                // only what the UI needs
                'roles:id,name',
                'createdBy:id,name',
            ])
            ->findOrFail($id);

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

    public function extendTrial(Request $request, User $user)
    {
        // 🛡️ Scope guard (same spirit as edit())
        if (!auth()->user()->hasRole('admin') && $user->created_by !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'mode' => 'required|in:add,set',
            'days' => 'required_if:mode,add|integer|min:1|max:365',
            'date' => 'required_if:mode,set|date|after:today',
        ]);

        // Choose base: later of current trial end or now
        $base = $user->trial_ends_at ? Carbon::parse($user->trial_ends_at) : now();
        if ($base->lessThan(now())) {
            $base = now();
        }

        if ($validated['mode'] === 'add') {
            $user->trial_ends_at = $base->clone()->addDays((int) $validated['days']);
        } else {
            $user->trial_ends_at = Carbon::parse($validated['date'])->endOfDay();
        }

        $user->save();

        return back()->with('success', 'Trial end updated.');
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
        $actor   = auth()->user();
        $isAdmin = $actor->hasRole('admin');

        // password is only required if actor wants to set it now (admin UI can send a reset link instead)
        $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => 'required|email|unique:users,email',
            'roles'  => 'array',

            // Flow toggles (admin can control; for non-admin we enforce defaults below)
            'mark_verified'     => 'sometimes|boolean',
            'send_invite'       => 'sometimes|boolean',
            'set_password_now'  => 'sometimes|boolean',

            // Required only when set_password_now is true
            'password' => [$request->boolean('set_password_now') ? 'required' : 'nullable', 'min:6', 'confirmed'],
        ]);

        // --- Role safety: non-admins cannot assign admin role
        $roleIds = $request->input('roles', []);
        if ($isAdmin) {
            // admin can assign anything
        } else {
            $forbiddenRoleIds = Role::where('name', 'admin')->pluck('id')->all();
            $roleIds = array_values(array_diff($roleIds, $forbiddenRoleIds));
        }

        // --- Flow policy (SaaS):
        // Admin-created users: follow toggles provided.
        // Non-admin-created users: auto-verify, always send invite, password set by user.
        $markVerified   = $isAdmin ? $request->boolean('mark_verified', true) : true; // ← default TRUE for admins
        $sendInvite     = $isAdmin ? $request->boolean('send_invite', true)   : true;
        $setPasswordNow = $isAdmin ? $request->boolean('set_password_now', false) : false;

        // If not setting password now, create with temp random (user will set via invite)
        $rawPassword = $setPasswordNow
            ? $request->input('password')
            : Str::random(32);

        $user = \App\Models\User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make($rawPassword),
            'created_by' => $actor->id, // ownership
        ]);

        $user->syncRoles($roleIds);

        // Verification behavior
        if ($markVerified) {
            $user->forceFill(['email_verified_at' => now()])->save();
        } else {
            // Require verification for this account
            $user->sendEmailVerificationNotification();
        }

        // Invite to set password (reset link). Works for verified or unverified users.
        if ($sendInvite) {
            Password::sendResetLink(['email' => $user->email]);
        }

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

    public function lineage(User $user)
    {
        // Optional: gate/permission check here (e.g., $this->authorize('viewAny', User::class))

        $tree = $this->buildTree($user);

        return Inertia::render('users/Lineage', [
            'root' => $tree,
        ]);
    }

    private function buildTree(User $user): array
    {
        // load roles for current node
        $user->loadMissing('roles:id,name');

        // fetch direct children (respecting your tenant scope; admin will see all)
        $children = User::with('roles:id,name')
            ->where('created_by', $user->id)
            ->orderBy('name')
            ->get();

        return [
            'id'        => $user->id,
            'name'      => $user->name,
            'email'     => $user->email,
            'roleNames' => $user->roles->pluck('name')->values(),
            'joinedAt'  => optional($user->created_at)->toIso8601String(),
            'children'  => $children->map(fn(User $u) => $this->buildTree($u))->values(),
        ];
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
