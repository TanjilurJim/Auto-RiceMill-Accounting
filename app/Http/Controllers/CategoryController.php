<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use function godown_scope_ids;

class CategoryController extends Controller
{
    // public function index()
    // {
    //     $categories = Category::query()
    //         ->where('created_by', auth()->id())
    //         ->orderBy('id', 'desc')
    //         ->paginate(10);

    //     return Inertia::render('categories/index', [
    //         'categories' => $categories, // Make sure it matches your frontend prop
    //     ]);
    // }

    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            $categories = Category::orderBy('id', 'desc')->paginate(10);
        } else {
            $ids = godown_scope_ids();
            $categories = Category::whereIn('created_by', $ids)
                ->orderBy('id', 'desc')
                ->paginate(10);
        }

        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Category::create([
            'name' => $request->name,
            'created_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Category added successfully!');
    }

    // public function update(Request $request, Category $category)
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //     ]);

    //     $category->update([
    //         'name' => $request->name,
    //     ]);

    //     return redirect()->back()->with('success', 'Category updated successfully!');
    // }

    public function update(Request $request, Category $category)
    {
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($category->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Category updated successfully!');
    }

    // public function destroy(Category $category)
    // {
    //     $category->delete();

    //     return redirect()->back()->with('success', 'Category deleted successfully!');
    // }

    public function destroy(Category $category)
    {
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($category->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        $category->delete();

        return redirect()->back()->with('success', 'Category deleted successfully!');
    }

}
