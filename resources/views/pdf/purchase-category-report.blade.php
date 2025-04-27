{{-- Category-wise Purchase Report --}}
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px }
        table { width:100%; border-collapse: collapse }
        th,td { border:1px solid #ddd; padding:4px 6px; }
        th   { background:#f1f5f9; font-weight:600 }
        .right { text-align:right }
    </style>
</head>
<body>
    {{-- ===== Header ===== --}}
    <div style="text-align:center; margin-bottom:12px">
        <h2 style="margin:0">{{ $company->company_name ?? 'Company Name' }}</h2>
        @if($company?->address)<div>{{ $company->address }}</div>@endif
        @if($company?->mobile)<div>Phone: {{ $company->mobile }}</div>@endif
        @if($company?->email)<div>Email: {{ $company->email }}</div>@endif

        <h3 style="margin:10px 0 0; text-decoration:underline">
            Category-wise Purchase Report
        </h3>
        <div>
            From <strong>{{ $filters['from_date'] }}</strong>
            to <strong>{{ $filters['to_date'] }}</strong>
        </div>
    </div>

    {{-- ===== Table ===== --}}
    <table>
        <thead>
            <tr>
                <th>#</th><th>Date</th><th>Vch No</th>
                <th>Account Ledger</th><th>Item Details</th>
                <th class="right">Qty</th><th>Unit</th>
                <th class="right">Price</th><th class="right">Total (Tk)</th>
            </tr>
        </thead>
        <tbody>
        @php($tQty=0)  @php($tAmt=0)
        @foreach($entries as $i => $r)
            @php($tQty += $r->total_qty) @php($tAmt += $r->net_amount)
            <tr>
                <td>{{ $i+1 }}</td>
                <td>{{ \Carbon\Carbon::parse($r->date)->format('d/m/Y') }}</td>
                <td>{{ $r->voucher_no }}</td>
                <td>{{ $r->supplier }}</td>
                <td>{{ $r->item }}</td>
                <td class="right">{{ number_format($r->total_qty,2) }}</td>
                <td>{{ $r->unit_name }}</td>
                <td class="right">{{ number_format($r->price_each,2) }}</td>
                <td class="right">{{ number_format($r->net_amount,2) }}</td>
            </tr>
        @endforeach
            {{-- Totals --}}
            <tr style="font-weight:600;background:#f9fafb">
                <td colspan="5" class="right">Grand Total</td>
                <td class="right">{{ number_format($tQty,2) }}</td>
                <td></td>
                <td></td>
                <td class="right">{{ number_format($tAmt,2) }}</td>
            </tr>
        </tbody>
    </table>

    <div style="margin-top:10px; font-size:10px">
        Printed at {{ now()->format('d/m/Y H:i') }}
    </div>
</body>
</html>
