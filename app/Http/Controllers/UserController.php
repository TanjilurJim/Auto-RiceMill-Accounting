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

        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'roles' => 'array',

            'mark_verified'     => 'sometimes|boolean',
            'send_invite'       => 'sometimes|boolean',
            'set_password_now'  => 'sometimes|boolean',
            'password'          => [$request->boolean('set_password_now') ? 'required' : 'nullable', 'min:6', 'confirmed'],

            // Trial fields validate only for admins (UI already hides for non-admins)
            'trial_mode' => 'nullable|in:add,set',
            'trial_days' => 'exclude_unless:trial_mode,add|nullable|integer|min:1|max:365',
            'trial_date' => 'exclude_unless:trial_mode,set|nullable|date|after:today',
        ]);

        // Role safety
        $roleIds = $request->input('roles', []);
        if (!$isAdmin) {
            $forbidden = \Spatie\Permission\Models\Role::where('name', 'admin')->pluck('id')->all();
            $roleIds = array_values(array_diff($roleIds, $forbidden));
        }

        // Flow toggles
        $markVerified   = $isAdmin ? $request->boolean('mark_verified', true) : true;
        $sendInvite     = $isAdmin ? $request->boolean('send_invite', true)   : true;
        $setPasswordNow = $isAdmin ? $request->boolean('set_password_now', false) : false;
        $rawPassword    = $setPasswordNow ? $request->input('password') : \Illuminate\Support\Str::random(32);

        // ---------- Trial logic ----------
        $trialEnds = null;

        if ($isAdmin && $request->filled('trial_mode')) {
            // Admin can set/extend on create
            $base = now();
            if ($request->trial_mode === 'add' && $request->filled('trial_days')) {
                $trialEnds = $base->clone()->addDays((int) $request->trial_days);
            } elseif ($request->trial_mode === 'set' && $request->filled('trial_date')) {
                $trialEnds = \Carbon\Carbon::parse($request->trial_date)->endOfDay();
            }
        } else {
            // Non-admin creator: inherit group head's trial (top-most under admin).
            // If group head has none, fallback to creator’s own trial.
            $headId   = get_top_parent_id($actor);                 // helper you shared
            $groupHead = $headId ? \App\Models\User::find($headId) : null;
            $trialEnds = optional($groupHead)->trial_ends_at ?? $actor->trial_ends_at;
        }

        // Create user (avoid fillable issues)
        $user = new \App\Models\User([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => \Illuminate\Support\Facades\Hash::make($rawPassword),
            'created_by' => $actor->id,
        ]);
        $user->trial_ends_at = $trialEnds;   // persist explicitly
        $user->save();

        $user->syncRoles($roleIds);

        if ($markVerified) {
            $user->forceFill(['email_verified_at' => now()])->save();
        } else {
            $user->sendEmailVerificationNotification();
        }

        if ($sendInvite) {
            \Illuminate\Support\Facades\Password::sendResetLink(['email' => $user->email]);
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
