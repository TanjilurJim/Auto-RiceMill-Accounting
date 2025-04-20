<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Stock Summary Report</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 20px;
        }

        h1 {
            font-size: 20px;
            text-align: center;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        .company-info {
            text-align: center;
            margin-bottom: 10px;
            line-height: 1.5;
        }

        .report-title {
            text-align: center;
            font-size: 16px;
            margin: 20px 0 10px;
            text-decoration: underline;
        }

        .date-range {
            text-align: center;
            font-size: 13px;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        th, td {
            border: 1px solid #999;
            padding: 6px 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        tfoot td {
            font-weight: bold;
            background-color: #f9f9f9;
        }

        .footer {
            text-align: right;
            font-size: 11px;
            margin-top: 10px;
        }
    </style>
</head>
<body>

    <h1>{{ $company->company_name }}</h1>

    <div class="company-info">
        @if($company->address) <div>{{ $company->address }}</div> @endif
        @if($company->mobile) <div>Phone: {{ $company->mobile }}</div> @endif
        @if($company->email || $company->website)
            <div>
                {{ $company->email }} 
                @if($company->email && $company->website) | @endif 
                {{ $company->website }}
            </div>
        @endif
    </div>

    <div class="report-title">Stock Summary Report</div>

    <div class="date-range">
        From: <strong>{{ $filters['from'] }}</strong> &nbsp; — &nbsp;
        To: <strong>{{ $filters['to'] }}</strong>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Item</th>
                <th>Godown</th>
                <th>Qty (Unit)</th>
                <th>Purchased</th>
                <th>Sold</th>
                <th>Last Purchase</th>
                <th>Last Sale</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totalQty = 0;
                $totalPurchase = 0;
                $totalSale = 0;
            @endphp
            @foreach($stocks as $stock)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $stock['item_name'] }}</td>
                    <td>{{ $stock['godown_name'] }}</td>
                    <td>{{ number_format($stock['qty'], 2) }} ({{ $stock['unit'] }})</td>
                    <td>{{ number_format($stock['total_purchase'], 2) }}</td>
                    <td>{{ number_format($stock['total_sale'], 2) }}</td>
                    <td>{{ optional($stock['last_purchase_at'])->format('d-m-Y') ?? '-' }}</td>
                    <td>{{ optional($stock['last_sale_at'])->format('d-m-Y') ?? '-' }}</td>
                </tr>
                @php
                    $totalQty += $stock['qty'];
                    $totalPurchase += $stock['total_purchase'];
                    $totalSale += $stock['total_sale'];
                @endphp
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" align="right">Total</td>
                <td>{{ number_format($totalQty, 2) }}</td>
                <td>{{ number_format($totalPurchase, 2) }}</td>
                <td>{{ number_format($totalSale, 2) }}</td>
                <td colspan="2"></td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        Generated on {{ now()->format('d M, Y h:i A') }}
    </div>

</body>
</html>
