<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Receivable & Payable Excel</title>
</head>
<body>
    <table>
        <tr>
            <td colspan="4" align="center" style="font-size: 18px;"><strong>Receivable & Payable Report</strong></td>
        </tr>
        <tr>
            <td colspan="4" align="center">From {{ $from_date }} to {{ $to_date }}</td>
        </tr>
    </table>

    <br>

    {{-- Receivables --}}
    <table border="1" cellspacing="0" cellpadding="4">
        <thead>
            <tr style="background-color: #d4edda;">
                <th>#</th>
                <th>Ledger Name</th>
                <th>Group</th>
                <th>Balance (DR)</th>
            </tr>
        </thead>
        <tbody>
            @php $totalDr = 0; @endphp
            @foreach ($receivables as $i => $r)
                @php $totalDr += $r['balance']; @endphp
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $r['ledger_name'] }}</td>
                    <td>{{ $r['group_name'] ?? '-' }}</td>
                    <td align="right">{{ number_format($r['balance'], 2) }}</td>
                </tr>
            @endforeach
            <tr>
                <td colspan="3" align="right"><strong>Total DR</strong></td>
                <td align="right"><strong>{{ number_format($totalDr, 2) }}</strong></td>
            </tr>
        </tbody>
    </table>

    <br>

    {{-- Payables --}}
    <table border="1" cellspacing="0" cellpadding="4">
        <thead>
            <tr style="background-color: #f8d7da;">
                <th>#</th>
                <th>Ledger Name</th>
                <th>Group</th>
                <th>Balance (CR)</th>
            </tr>
        </thead>
        <tbody>
            @php $totalCr = 0; @endphp
            @foreach ($payables as $i => $p)
                @php $totalCr += $p['balance']; @endphp
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $p['ledger_name'] }}</td>
                    <td>{{ $p['group_name'] ?? '-' }}</td>
                    <td align="right">{{ number_format($p['balance'], 2) }}</td>
                </tr>
            @endforeach
            <tr>
                <td colspan="3" align="right"><strong>Total CR</strong></td>
                <td align="right"><strong>{{ number_format($totalCr, 2) }}</strong></td>
            </tr>
        </tbody>
    </table>
</body>
</html>
