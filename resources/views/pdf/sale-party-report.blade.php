<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Party-wise Sale Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
        }

        .company-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .company-header h1 {
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
        }

        .company-header p {
            margin: 2px 0;
            font-size: 12px;
        }

        .report-title {
            text-align: center;
            margin-top: 10px;
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: bold;
            text-decoration: underline;
        }

        .filter-info {
            text-align: center;
            margin-bottom: 20px;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }

        th,
        td {
            border: 1px solid #999;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #eee;
        }

        tfoot td {
            font-weight: bold;
            background-color: #f9f9f9;
        }

        .text-right {
            text-align: right;
        }

        .footer {
            margin-top: 20px;
            font-size: 10px;
            text-align: center;
            color: #777;
        }
    </style>
</head>

<body>

    <div class="company-header">
        <h1>{{ $company['company_name'] }}</h1>
        @if (!empty($company['address']))
            <p>{{ $company['address'] }}</p>
        @endif
        @if (!empty($company['mobile']))
            <p>Phone: {{ $company['mobile'] }}</p>
        @endif
        @if (!empty($company['email']))
            <p>Email: {{ $company['email'] }}</p>
        @endif
    </div>

    <div class="report-title">
        Party-wise Sales Report
    </div>

    <div class="filter-info">
        @if (!empty($filters['year']))
            Showing for Year <strong>{{ $filters['year'] }}</strong>
        @else
            From <strong>{{ $filters['from_date'] }}</strong> to <strong>{{ $filters['to_date'] }}</strong>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Party</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @php
                $grandQty = 0;
                $grandAmount = 0;
            @endphp
            @forelse ($entries as $index => $r)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $r->party_name }}</td>
                    <td class="text-right">{{ number_format($r->total_qty ?? 0, 2) }}</td>
                    <td class="text-right">{{ number_format($r->total_amount ?? 0, 2) }}</td>
                    @php
                        $grandQty += $r->total_qty ?? 0;
                        $grandAmount += $r->total_amount ?? 0;
                    @endphp
                </tr>
            @empty
                <tr>
                    <td colspan="4" style="text-align: center; color: #999;">No data found.</td>
                </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2" class="text-right">Grand Total</td>
                <td class="text-right">{{ number_format($grandQty, 2) }}</td>
                <td class="text-right">{{ number_format($grandAmount, 2) }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        Report generated on {{ now()->format('d-m-Y h:i A') }}
    </div>

</body>

</html>
