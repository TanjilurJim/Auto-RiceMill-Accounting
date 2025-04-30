<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sales Return Report</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: center;
        }
        h2, h4 {
            text-align: center;
            margin: 0;
        }
        .company-info {
            margin-bottom: 10px;
            text-align: center;
        }
    </style>
</head>
<body>

    <div class="company-info">
        <h2>{{ $company->name ?? 'Company Name' }}</h2>
        <h4>Sales Return Report</h4>
        <h4>From {{ $filters['from_date'] ?? '' }} To {{ $filters['to_date'] ?? '' }}</h4>
    </div>

    <table>
        <thead>
            <tr>
                <th>Sl</th>
                <th>Date</th>
                <th>Voucher No</th>
                <th>Party</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            @php $grandTotal = 0; @endphp
            @foreach($entries as $key => $entry)
                @php $grandTotal += $entry->amount ?? 0; @endphp
                <tr>
                    <td>{{ $key + 1 }}</td>
                    <td>{{ $entry->return_date }}</td>
                    <td>{{ $entry->voucher_no }}</td>
                    <td>{{ $entry->party }}</td>
                    <td>{{ $entry->item_name }}</td>
                    <td>{{ number_format($entry->qty, 2) }}</td>
                    <td>{{ $entry->unit_name }}</td>
                    <td>{{ number_format($entry->rate, 2) }}</td>
                    <td>{{ number_format($entry->amount, 2) }}</td>
                </tr>
            @endforeach
            <tr>
                <td colspan="8" style="text-align: right; font-weight: bold;">Grand Total</td>
                <td style="font-weight: bold;">{{ number_format($grandTotal, 2) }}</td>
            </tr>
        </tbody>
    </table>

</body>
</html>
