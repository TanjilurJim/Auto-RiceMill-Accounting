<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Salesman-wise Sale Report</title>
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
            vertical-align: middle;
            white-space: nowrap;
        }

        th {
            background-color: #eee;
        }

        tfoot td {
            font-weight: bold;
            background-color: #f9f9f9;
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
        Salesman-wise Sale Report
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
                <th>Date</th>
                <th>Voucher No</th>
                <th>Party</th>
                <th>Salesman</th>
                <th>Item</th>
                <th style="text-align:right;">Qty</th>
                <th>Unit</th>
                <th style="text-align:right;">Rate</th>
                <th style="text-align:right;">Amount (Tk)</th>
            </tr>
        </thead>
        <tbody>
            @php
                $grandQty = 0;
                $grandAmount = 0;
            @endphp
            @forelse ($entries as $i => $r)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($r->date)->format('d-m-Y') }}</td>
                    <td>{{ $r->voucher_no }}</td>
                    <td>{{ $r->party }}</td>
                    <td>{{ $r->salesman_name }}</td>
                    <td>{{ $r->item_name }}</td>
                    <td style="text-align:right;">{{ number_format($r->qty ?? 0, 2) }}</td>
                    <td>{{ $r->unit_name }}</td>
                    <td style="text-align:right;">{{ number_format($r->rate ?? 0, 2) }}</td>
                    <td style="text-align:right;">{{ number_format($r->amount ?? 0, 2) }}</td>
                </tr>
                @php
                    $grandQty += $r->qty ?? 0;
                    $grandAmount += $r->amount ?? 0;
                @endphp
            @empty
                <tr>
                    <td colspan="10" style="text-align: center; color: #999;">No data found.</td>
                </tr>
            @endforelse
        </tbody>

        {{-- ─── Grand Total Row ─── --}}
        <tfoot>
            <tr>
                <td colspan="5" style="text-align:right;">Grand Total</td>
                <td></td>
                <td style="text-align:right;">{{ number_format($grandQty, 2) }}</td>
                <td></td>
                <td></td>
                <td style="text-align:right;">{{ number_format($grandAmount, 2) }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        Generated on {{ \Carbon\Carbon::now()->format('d-m-Y h:i A') }}
    </div>

</body>

</html>
