<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>All Received & Payment Report</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }

        .company-info {
            text-align: center;
            margin-bottom: 10px;
        }

        .company-info h2 {
            margin: 0;
            font-size: 18px;
        }

        .report-title {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
        }

        th,
        td {
            border: 1px solid #aaa;
            padding: 5px;
            text-align: left;
        }

        th {
            background-color: #f0f0f0;
        }

        .total {
            font-weight: bold;
            background-color: #f0f0f0;
        }
    </style>
</head>

<body>

    <div class="company-info" style="display:flex;align-items:center;gap:10px;">
        @if ($company->thumb_path)           {{-- local path inside the container --}}
            <img src="{{ $company->thumb_path }}" style="height:55px;">
        @endif

        <h2>{{ $company['company_name'] ?? 'Company Name' }}</h2>
        @if (!empty($company['address']))
            <div>{{ $company['address'] }}</div>
        @endif
        @if (!empty($company['phone']))
            <div>Phone: {{ $company['phone'] }}</div>
        @endif
        @if (!empty($company['email']))
            <div>Email: {{ $company['email'] }}</div>
        @endif
    </div>

    <div class="report-title">
        All Received & Payment Report<br>
        <small>From {{ $from }} to {{ $to }}</small>
    </div>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Voucher No</th>
                <th>Type</th>
                <th>Ledger</th>
                <th>Mode Ledger</th>
                <th>Amount</th>
                <th>Created By</th>
            </tr>
        </thead>
        <tbody>
            @php $total = 0; @endphp
            @foreach ($entries as $entry)
                <tr>
                    <td>{{ $entry['date'] }}</td>
                    <td>{{ $entry['voucher_no'] }}</td>
                    <td>{{ $entry['type'] }}</td>
                    <td>{{ $entry['ledger'] }}</td>
                    <td>{{ $entry['mode_ledger'] }}</td>
                    <td style="text-align:right">{{ number_format($entry['amount'], 2) }}</td>
                    <td>{{ $entry['created_by'] }}</td>
                </tr>
                @php $total += $entry['amount']; @endphp
            @endforeach
            <tr class="total">
                <td colspan="5" style="text-align:right;">Total</td>
                <td style="text-align:right;">{{ number_format($total, 2) }}</td>
                <td></td>
            </tr>
        </tbody>
    </table>

</body>

</html>
