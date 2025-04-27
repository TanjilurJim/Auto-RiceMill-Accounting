{{-- resources/views/pdf/purchase-return-report.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Purchase Return Report</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 16px; text-transform: uppercase; }
        .header p { margin: 2px 0; }
        .filters { margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { border: 1px solid #333; padding: 4px; vertical-align: top; }
        th { background-color: #eee; }
        .text-right { text-align: right; }
        .totals { font-weight: bold; background-color: #f5f5f5; }
        ul { margin: 4px 0 0 16px; padding: 0; }
        li { list-style: disc inside; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $company->company_name }}</h1>
        @if($company->address)
            <p>{{ $company->address }}</p>
        @endif
        @if($company->mobile)
            <p>Phone: {{ $company->mobile }}</p>
        @endif
        @if($company->email)
            <p>{{ $company->email }}</p>
        @endif
    </div>

    <div class="filters">
        <h2>Purchase Return Report</h2>
        <p>
            From: <strong>{{ \Carbon\Carbon::parse($filters['from_date'])->format('d-M-Y') }}</strong>
            &nbsp;To: <strong>{{ \Carbon\Carbon::parse($filters['to_date'])->format('d-M-Y') }}</strong>
        </p>
    </div>

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
                <th class="text-right">Return (Tk)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($entries as $i => $r)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($r->date)->format('d-M-Y') }}</td>
                    <td>{{ $r->voucher_no }}</td>
                    <td>{{ $r->supplier }}</td>
                    <td>{!! nl2br(e($r->item)) !!}</td>
                    <td class="text-right">{{ number_format($r->qty, 2) }}</td>
                    <td>{{ $r->unit_name }}</td>
                    <td class="text-right">{{ number_format($r->net_return, 2) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="text-center">No purchase-return data found.</td>
                </tr>
            @endforelse

            @if(count($entries))
                <tr class="totals">
                    <td colspan="5" class="text-right">Grand Total</td>
                    <td class="text-right">{{ number_format($entries->sum('qty'), 2) }}</td>
                    <td></td>
                    <td class="text-right">{{ number_format($entries->sum('net_return'), 2) }}</td>
                </tr>
                <tr>
                    <td colspan="8">
                        <strong>Total Qty by Unit:</strong>
                        <ul>
                            @foreach($entries->groupBy('unit_name') as $unit => $group)
                                @if($unit)
                                    <li>{{ number_format($group->sum('qty'), 2) }} {{ $unit }}</li>
                                @endif
                            @endforeach
                        </ul>
                    </td>
                </tr>
            @endif
        </tbody>
    </table>

    <div style="font-size: 10px; text-align: center; margin-top: 20px;">
        Generated on: {{ now()->format('d-M-Y H:i') }}
    </div>
</body>
</html>
