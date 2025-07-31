<?php

namespace App\Http\Controllers;

use App\Models\Godown;
use Illuminate\Http\Request;
use Inertia\Inertia;
use function godown_scope_ids;

class GodownController extends Controller
{


    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            $godowns = Godown::with('creator')->orderBy('id', 'desc')->paginate(10);
        } else {
            $ids = godown_scope_ids();
            $godowns = Godown::with('creator')
                ->whereIn('created_by', $ids)
                ->orderBy('id', 'desc')
                ->paginate(10)
                // ->withQueryString()
            ;
        }

        return Inertia::render('godowns/index', [
            'godowns' => $godowns
        ]);
    }



    public function create()
    {
        return Inertia::render('godowns/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'khamal_count'  => 'nullable|integer|min:0',
        ]);

        $lastGodown = Godown::orderBy('id', 'desc')->first();
        $nextId = $lastGodown ? $lastGodown->id + 1 : 1;
        $godownCode = 'GD-' . rand(1, 999) . '-' . $nextId;

        $godown = Godown::create([
            'name' => $request->name,
            'godown_code' => $godownCode,
            'address' => $request->address,
            'created_by' => auth()->id(),
        ]);

        /* Create khamals 1…N */
        $headId = auth()->id();           // or get_top_parent_id()
        $n      = (int) $request->khamal_count;
        for ($i = 1; $i <= $n; $i++) {
            $godown->khamals()->create([
                'khamal_no'  => $i,
                'created_by' => $headId,
            ]);
        }

        return redirect()->route('godowns.index')->with('success', 'Godown created successfully with.' . $n . 'Khamal(s)');
    }


    public function edit(Godown $godown)
    {
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($godown->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        /* eager-load khamals just in case the view needs them */
        $godown->load('khamals');

        return Inertia::render('godowns/edit', [
            'godown'        => $godown,
            'khamalCount'   => $godown->khamals->count(),   // 🆕
            // Or send full collection if you need names/capacity:
            'khamals'    => $godown->khamals->map->only(['id','khamal_no','capacity_ton']),
        ]);
    }




    public function update(Request $request, Godown $godown)
    {
        $user = auth()->user();

        // Admin can update any godown
        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($godown->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'khamal_count'  => 'nullable|integer|min:0',
        ]);

        $godown->update([
            'name' => $request->name,
            'address' => $request->address,
        ]);

        if ($request->filled('khamal_count')) {
            $current = $godown->khamals()->count();
            $target  = (int) $request->khamal_count;

            if ($target > $current) {
                for ($i = $current + 1; $i <= $target; $i++) {
                    $godown->khamals()->create([
                        'khamal_no'  => $i,
                        'created_by' => auth()->id(),
                    ]);
                }
            }
            // (keeping it simple — we do NOT auto-delete extras if user enters a smaller number)
        }


        return redirect()->route('godowns.index')->with('success', 'Godown updated successfully.');
    }



    public function destroy(Godown $godown)
    {
        $user = auth()->user();

        // Admin can delete any godown
        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($godown->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        $godown->delete();

        return redirect()->route('godowns.index')->with('success', 'Godown deleted successfully.');
    }
}
