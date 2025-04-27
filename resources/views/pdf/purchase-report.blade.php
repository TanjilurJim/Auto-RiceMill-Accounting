@php
    use Illuminate\Support\Arr;
    $is = fn ($t) => $tab === $t;             // little helper
@endphp
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{ ucfirst($tab) }} purchase report</title>

    {{-- very small inline stylesheet; DomPDF understands only basic CSS --}}
    <style>
        *{ font-family: DejaVu Sans, sans-serif; font-size: 10px; }
        h1{ font-size:20px; margin:0 }
        h2{ font-size:14px; margin:4px 0 }
        table{ width:100%; border-collapse:collapse; margin-top:6px }
        th,td{ border:1px solid #666; padding:4px 3px }
        th{ background:#eee }
        .right{ text-align:right }
        .total-row td{ font-weight:bold; background:#f5f5f5 }
    </style>
</head>
<body>

    {{-- ── company header ───────────────────────────────────────── --}}
    <div style="text-align:center">
        <h1>{{ $company->company_name ?? 'Company name' }}</h1>
        @if($company?->address)<div>{{ $company->address }}</div>@endif
        @if($company?->email || $company?->website)
            <div>
                {{ $company?->email }}{{ $company?->email && $company?->website ? ' | ' : '' }}{{ $company?->website }}
            </div>
        @endif
    </div>

    <h2 style="text-align:center; text-decoration:underline; margin-top:12px">
        {{ ucfirst($tab) }}-wise Purchase Report
    </h2>
    <div style="text-align:center; margin-bottom:10px">
        From <strong>{{ $filters['from_date'] }}</strong>
        to <strong>{{ $filters['to_date'] }}</strong>
    </div>

    {{-- ── table header decides by $tab ─────────────────────────── --}}
    <table>
        <thead>
        <tr>
            @if($is('category') || $is('party') || $is('return') || $is('all'))
                <th>#</th><th>Date</th><th>Vch No</th>
            @endif

            @if($is('category'))     <th>Account Ledger</th>@endif
            @if($is('item'))         <th>#</th>@endif  {{-- numbering column --}}
            @if($is('party')||$is('all')||$is('return')) <th>Supplier</th>@endif

            @if($is('category'))     <th>Item</th>@endif
            @if($is('item'))         <th>Item</th>@endif
            @if($is('party')||$is('all')) <th>Item</th>@endif

            @if(!$is('return'))      <th>Qty</th><th>Unit</th>@endif
            <th class="right">{{ $is('return') ? 'Return (Tk)' : 'Net (Tk)' }}</th>

            @if($is('party')||$is('all')) <th class="right">Paid (Tk)</th><th class="right">Due (Tk)</th>@endif
        </tr>
        </thead>

        <tbody>
        @php $i=1; $tot = ['qty'=>0,'net'=>0,'paid'=>0,'due'=>0]; @endphp
        @foreach($entries as $row)
            @php
                /* accumulate grand-totals (only where columns exist) */
                $tot['qty']  += Arr::get($row,'qty',Arr::get($row,'total_qty',0));
                $tot['net']  += Arr::get($row,'net_amount', Arr::get($row,'net_return',0));
                $tot['paid'] += $row->amount_paid  ?? 0;
                $tot['due']  += $row->due          ?? 0;
            @endphp
            <tr>
                {{-- 1) index / date / voucher ------------------------------------------------- --}}
                @if($is('category')||$is('party')||$is('return')||$is('all'))
                    <td>{{ $i++ }}</td>
                    <td>{{ \Carbon\Carbon::parse($row->date)->format('d/m/Y') }}</td>
                    <td>{{ $row->voucher_no }}</td>
                @endif

                {{-- 2) supplier / ledger / item ---------------------------------------------- --}}
                @if($is('category'))     <td>{{ $row->supplier }}</td>@endif
                @if($is('item'))         <td>{{ $i }}</td>@endif
                @if($is('party')||$is('all')||$is('return'))
                                          <td>{{ $row->supplier }}</td>@endif

                <td>
                    @if($is('item'))      {{ $row->item_name }}
                    @else                 {{ $row->item ?? '—' }}
                    @endif
                </td>

                {{-- 3) qty / unit / money ------------------------------------------------------ --}}
                @if(!$is('return'))
                    <td class="right">{{ number_format($row->qty ?? $row->total_qty,2) }}</td>
                    <td>{{ $row->unit_name ?? '' }}</td>
                @endif

                <td class="right">
                    {{ number_format($row->net_amount ?? $row->net_return,2) }}
                </td>

                @if($is('party')||$is('all'))
                    <td class="right">{{ number_format($row->amount_paid,2) }}</td>
                    <td class="right">{{ number_format($row->due,2) }}</td>
                @endif
            </tr>
        @endforeach

        {{-- ── grand-total row (only columns that exist) ─────────── --}}
        <tr class="total-row">
            @php $colspan = $is('category') ? 5 :
                             ($is('item') ? 2 :
                             ($is('party')||$is('all') ? 6 :
                             ($is('return') ? 4 : 0))); @endphp
            <td colspan="{{ $colspan }}" class="right">Grand&nbsp;Total</td>

            @if(!$is('return'))
                <td class="right">{{ number_format($tot['qty'],2) }}</td>
                <td></td>
            @endif

            <td class="right">{{ number_format($tot['net'],2) }}</td>

            @if($is('party')||$is('all'))
                <td class="right">{{ number_format($tot['paid'],2) }}</td>
                <td class="right">{{ number_format($tot['due'],2) }}</td>
            @endif
        </tr>
        </tbody>
    </table>
</body>
</html>
