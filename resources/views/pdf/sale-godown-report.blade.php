// 📄 sale-godown-report.blade.php (PDF Blade Template)
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Godown-wise Sale Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #999;
            padding: 6px;
            text-align: left;
        }

        th {
            background: #eee;
        }

        tfoot td {
            font-weight: bold;
            background: #f9f9f9;
        }

        .text-right {
            text-align: right;
        }

        .header,
        .footer {
            text-align: center;
        }

        .footer {
            margin-top: 20px;
            font-size: 10px;
            color: #777;
        }
    </style>
</head>

<body>

    <div class="header">
        <h2>{{ $company['company_name'] }}</h2>
        @if (!empty($company['address']))
            <p>{{ $company['address'] }}</p>
        @endif
        @if (!empty($company['mobile']))
            <p>Phone: {{ $company['mobile'] }}</p>
        @endif
        @if (!empty($company['email']))
            <p>Email: {{ $company['email'] }}</p>
        @endif

        <h3 style="text-decoration: underline;">Godown-wise Sales Report</h3>
        @if (!empty($filters['year']))
            <p>Showing for Year <strong>{{ $filters['year'] }}</strong></p>
        @else
            <p>From <strong>{{ $filters['from_date'] }}</strong> to <strong>{{ $filters['to_date'] }}</strong></p>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Date</th>
                <th>Voucher</th>
                <th>Party</th>
                <th>Godown</th>
                <th>Item</th>
                <th class="text-right">Qty</th>
                <th>Unit</th>
                <th class="text-right">Rate</th>
                <th class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totalQty = 0;
                $totalAmount = 0;
            @endphp
            @forelse ($entries as $i => $r)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($r->date)->format('d/m/Y') }}</td>
                    <td>{{ $r->voucher_no }}</td>
                    <td>{{ $r->party }}</td>
                    <td>{{ $r->godown_name }}</td>
                    <td>{{ $r->item_name }}</td>
                    <td class="text-right">{{ number_format($r->qty, 2) }}</td>
                    <td>{{ $r->unit_name }}</td>
                    <td class="text-right">{{ number_format($r->rate, 2) }}</td>
                    <td class="text-right">{{ number_format($r->amount, 2) }}</td>
                </tr>
                @php
                    $totalQty += $r->qty;
                    $totalAmount += $r->amount;
                @endphp
            @empty
                <tr>
                    <td colspan="10" style="text-align: center; color: #999;">No data found.</td>
                </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr>
                <td colspan="6" class="text-right">Grand Total</td>
                <td class="text-right">{{ number_format($totalQty, 2) }}</td>
                <td></td>
                <td></td>
                <td class="text-right">{{ number_format($totalAmount, 2) }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        Generated on {{ now()->format('d/m/Y h:i A') }}<br>
        {{ $company['company_name'] }} — {{ $company['email'] ?? '' }}
    </div>

</body>

</html>
