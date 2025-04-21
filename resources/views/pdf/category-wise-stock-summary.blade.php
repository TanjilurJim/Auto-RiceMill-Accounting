<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Category Wise Stock Summary</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #333; margin: 20px; }
        h1 { font-size: 20px; text-align: center; margin-bottom: 5px; text-transform: uppercase; }
        .company-info { text-align: center; margin-bottom: 10px; line-height: 1.5; }
        .report-title { text-align: center; font-size: 16px; margin: 20px 0 10px; text-decoration: underline; }
        .date-range { text-align: center; font-size: 13px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { border: 1px solid #999; padding: 6px 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tfoot td { font-weight: bold; background-color: #f9f9f9; }
        .footer { text-align: right; font-size: 11px; margin-top: 10px; }
    </style>
</head>
<body>
    <h1>{{ $company->company_name }}</h1>
    <div class="company-info">
        @if($company->address) <div>{{ $company->address }}</div> @endif
        @if($company->mobile) <div>Phone: {{ $company->mobile }}</div> @endif
        @if($company->email || $company->website)
            <div>{{ $company->email }} @if($company->email && $company->website) | @endif {{ $company->website }}</div>
        @endif
    </div>
    <div class="report-title">Category Wise Stock Summary</div>
    <div class="date-range">From: <strong>{{ $filters['from'] }}</strong> — To: <strong>{{ $filters['to'] }}</strong></div>
    <table>
        <thead>
            <tr>
                <th>#</th><th>Category</th><th>Total Qty</th><th>Total Purchase</th><th>Total Sale</th>
                <th>Last Purchase</th><th>Purchase Qty</th><th>Last Sale</th><th>Sale Qty</th>
            </tr>
        </thead>
        <tbody>
            @foreach($categories as $i => $cat)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $cat['category_name'] }}</td>
                    <td>{{ number_format($cat['total_qty'], 2) }}</td>
                    <td>{{ number_format($cat['total_purchase'], 2) }}</td>
                    <td>{{ number_format($cat['total_sale'], 2) }}</td>
                    <td>{{ optional($cat['last_purchase_at'])->format('d-m-Y') ?? '-' }}</td>
                    <td>{{ number_format($cat['last_purchase_qty'], 2) }} {{ $cat['last_purchase_unit'] ?? '' }}</td>
                    <td>{{ optional($cat['last_sale_at'])->format('d-m-Y') ?? '-' }}</td>
                    <td>{{ number_format($cat['last_sale_qty'], 2) }} {{ $cat['last_sale_unit'] ?? '' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
    <div class="footer">Generated on {{ now()->format('d M, Y h:i A') }}</div>
</body>
</html>
