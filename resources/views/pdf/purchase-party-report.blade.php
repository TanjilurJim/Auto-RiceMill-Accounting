{{--  resources/views/pdf/purchase-party-report.blade.php  --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Party-wise Purchase Report</title>
    <style>
        /* DomPDF ignores Tailwind; use plain CSS */
        body        { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        h1,h2       { margin: 0; padding: 0; }
        table       { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td      { border: 1px solid #444; padding: 4px 6px; }
        th          { background: #f3f4f6; text-align: left; }
        .text-right { text-align: right; }
        .totals     { background: #f3f4f6; font-weight: 600; }
        .footer     { margin-top: 20px; font-size: 11px; color: #555; }
    </style>
</head>
<body>
    {{-- ── Header ─────────────────────────────────────────────── --}}
    <div style="text-align:center">
        <h1 style="text-transform:uppercase">{{ $company->company_name ?? 'Company Name' }}</h1>
        @if($company?->address)<div>{{ $company->address }}</div>@endif
        @if($company?->mobile)<div>Phone: {{ $company->mobile }}</div>@endif
        @if($company?->email)<div>Email: {{ $company->email }}</div>@endif

        <h2 style="margin-top:12px; text-decoration:underline">
            Party-wise Purchase Report
        </h2>
        <div style="margin-top:4px">
            From <strong>{{ $filters['from_date'] }}</strong>
            to <strong>{{ $filters['to_date'] }}</strong>
        </div>
    </div>

    {{-- ── Table ──────────────────────────────────────────────── --}}
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Date</th>
                <th>Vch No</th>
                <th>Supplier</th>
                <th>Item</th>
                <th class="text-right">Qty</th>
                <th>Unit</th>
                <th class="text-right">Net (Tk)</th>
                <th class="text-right">Paid (Tk)</th>
                <th class="text-right">Due (Tk)</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totQty  = $totNet = $totPaid = $totDue = 0;
                $unitBuckets = [];
            @endphp

            @foreach($entries as $i => $r)
                @php
                    $totQty  += $r->qty;
                    $totNet  += $r->net_amount;
                    $totPaid += $r->amount_paid;
                    $totDue  += $r->due;
                    $unitBuckets[$r->unit_name] = ($unitBuckets[$r->unit_name] ?? 0) + $r->qty;
                @endphp
                <tr>
                    <td>{{ $i+1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($r->date)->format('d-m-Y') }}</td>
                    <td>{{ $r->voucher_no }}</td>
                    <td>{{ $r->supplier }}</td>
                    <td>{{ $r->item }}</td>
                    <td class="text-right">{{ number_format($r->qty,2) }}</td>
                    <td>{{ $r->unit_name }}</td>
                    <td class="text-right">{{ number_format($r->net_amount,2) }}</td>
                    <td class="text-right">{{ number_format($r->amount_paid,2) }}</td>
                    <td class="text-right">{{ number_format($r->due,2) }}</td>
                </tr>
            @endforeach

            {{-- grand-total row --}}
            <tr class="totals">
                <td colspan="5" class="text-right">Grand&nbsp;Total</td>
                <td class="text-right">{{ number_format($totQty,2) }}</td>
                <td></td>
                <td class="text-right">{{ number_format($totNet,2) }}</td>
                <td class="text-right">{{ number_format($totPaid,2) }}</td>
                <td class="text-right">{{ number_format($totDue,2) }}</td>
            </tr>
        </tbody>
    </table>

    {{-- Qty-by-unit list --}}
    <div style="margin-top:10px">
        <strong>Total Qty by Unit:</strong>
        <ul style="margin:4px 0 0 18px; padding:0;">
            @foreach($unitBuckets as $u => $q)
                <li>{{ number_format($q,2) }} {{ $u }}</li>
            @endforeach
        </ul>
    </div>

    {{-- Footer --}}
    <div class="footer">
        Generated on {{ now()->format('d-m-Y H:i') }}
    </div>
</body>
</html>

