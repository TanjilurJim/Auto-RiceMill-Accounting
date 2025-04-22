<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Item Wise Stock Summary</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 20px;
        }
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

<div class="report-title">Item Wise Stock Summary</div>

<div class="date-range">
    From: <strong>{{ $filters['from'] }}</strong> — To: <strong>{{ $filters['to'] }}</strong>
</div>

<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Item</th>
            <th>Unit</th>
            <th>Qty</th>
            <th>Purchase</th>
            <th>Sale</th>
            <th>Sale Qty</th>
            <th>Last Purchase</th>
            <th>Purchase Qty</th>
            <th>Last Sale</th>
            <th>Sale Qty</th>
        </tr>
    </thead>
    <tbody>
        @php
            $totalQty = 0;
            $totalPurchase = 0;
            $totalSale = 0;
            $totalSaleQty = 0;
        @endphp
        @foreach($items as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $item['item_name'] }}</td>
                <td>{{ $item['unit'] }}</td>
                <td>{{ number_format($item['total_qty'], 2) }}</td>
                <td>{{ number_format($item['total_purchase'], 2) }}</td>
                <td>{{ number_format($item['total_sale'], 2) }}</td>
                <td>{{ number_format($item['total_sale_qty'], 2) }}</td>
                <td>{{ optional($item['last_purchase_at'])->format('d-m-Y') ?? '-' }}</td>
                <td>{{ number_format($item['last_purchase_qty'], 2) }}</td>
                <td>{{ optional($item['last_sale_at'])->format('d-m-Y') ?? '-' }}</td>
                <td>{{ number_format($item['last_sale_qty'], 2) }}</td>
            </tr>
            @php
                $totalQty += $item['total_qty'];
                $totalPurchase += $item['total_purchase'];
                $totalSale += $item['total_sale'];
                $totalSaleQty += $item['total_sale_qty'];
            @endphp
        @endforeach
    </tbody>
    <tfoot>
        <tr>
            <td colspan="3" align="right">Total</td>
            <td>{{ number_format($totalQty, 2) }}</td>
            <td>{{ number_format($totalPurchase, 2) }}</td>
            <td>{{ number_format($totalSale, 2) }}</td>
            <td>{{ number_format($totalSaleQty, 2) }}</td>
            <td colspan="4"></td>
        </tr>
    </tfoot>
</table>

<div class="footer">Generated on {{ now()->format('d M, Y h:i A') }}</div>

</body>
</html>
