<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receivable & Payable Report</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
            color: #000;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .company-name {
            font-size: 18px;
            font-weight: bold;
        }

        .company-info {
            font-size: 12px;
            color: #555;
        }

        h3 {
            margin: 20px 0 10px;
            font-size: 14px;
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        th, td {
            border: 1px solid #aaa;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #f1f1f1;
        }

        .right {
            text-align: right;
        }

        .total-row {
            font-weight: bold;
            background-color: #eee;
        }

        .section-title {
            font-size: 14px;
            margin-top: 30px;
            color: #000;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <div class="header">
        @if($company && $company->logo && file_exists(public_path('uploads/company/' . $company->logo)))
            <img src="{{ public_path('uploads/company/' . $company->logo) }}" height="60" style="margin-bottom: 10px;">
        @endif

        <div class="company-name">{{ $company->company_name ?? 'Company Name' }} <br></div>
        <div class="company-info">
            {{ $company->address ?? '' }}<br>
            Phone: {{ $company->phone ?? '' }}
        </div>

        <h3>All Receivable & Payable Report</h3>
        <p>Report Period: <strong>{{ $from_date }}</strong> to <strong>{{ $to_date }}</strong></p>
    </div>

    {{-- Receivables --}}
    <div class="section-title">Receivables (DR)</div>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Ledger Name</th>
                <th>Group</th>
                <th class="right">Balance (DR)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($receivables as $i => $r)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $r['ledger_name'] }}</td>
                    <td>{{ $r['group_name'] ?? '-' }}</td>
                    <td class="right">{{ number_format($r['balance'], 2) }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="3" class="right">Total</td>
                <td class="right">{{ number_format(collect($receivables)->sum('balance'), 2) }}</td>
            </tr>
        </tbody>
    </table>

    {{-- Payables --}}
    <div class="section-title">Payables (CR)</div>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Ledger Name</th>
                <th>Group</th>
                <th class="right">Balance (CR)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($payables as $i => $p)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $p['ledger_name'] }}</td>
                    <td>{{ $p['group_name'] ?? '-' }}</td>
                    <td class="right">{{ number_format($p['balance'], 2) }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="3" class="right">Total</td>
                <td class="right">{{ number_format(collect($payables)->sum('balance'), 2) }}</td>
            </tr>
        </tbody>
    </table>

</body>
</html>
