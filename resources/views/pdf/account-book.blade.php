<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Account Book</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background-color: #f0f0f0; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
    </style>
</head>
<body>

    <h2 class="text-center">{{ $company->company_name ?? 'Company Name' }}</h2>
    @if ($company->address)<p class="text-center">{{ $company->address }}</p>@endif
    @if ($company->email)<p class="text-center">Email: {{ $company->email }}</p>@endif
    @if ($company->website)<p class="text-center">Website: {{ $company->website }}</p>@endif
    @if ($company->financial_year)
        <p class="text-center"><strong>Financial Year:</strong> {{ $company->financial_year }}</p>
    @endif

    <p class="text-center"><strong>Ledger:</strong> {{ $ledger['account_ledger_name'] }}</p>
    <p class="text-center">From: {{ $from }} — To: {{ $to }}</p>
    <p class="text-center">Opening Balance: {{ number_format(abs($opening_balance), 2) }} {{ $ledger['debit_credit'] === 'debit' ? 'Dr' : 'Cr' }}</p>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Vch. No</th>
                <th>Accounts</th>
                <th>Note</th>
                <th class="text-right">Debit (TK)</th>
                <th class="text-right">Credit (TK)</th>
                <th class="text-right">Balance (TK)</th>
            </tr>
        </thead>
        <tbody>
            @php $runningBalance = $opening_balance; $totalDebit = 0; $totalCredit = 0; @endphp
            @foreach ($entries as $entry)
                @php
                    $debit = $entry['debit'] ?? 0;
                    $credit = $entry['credit'] ?? 0;
                    $runningBalance += $debit - $credit;
                    $totalDebit += $debit;
                    $totalCredit += $credit;
                @endphp
                <tr>
                    <td>{{ $entry['date'] }}</td>
                    <td>{{ $entry['type'] }}</td>
                    <td>{{ $entry['voucher_no'] }}</td>
                    <td>{{ $entry['account'] }}</td>
                    <td>{{ $entry['note'] }}</td>
                    <td class="text-right">{{ number_format($debit, 2) }}</td>
                    <td class="text-right">{{ number_format($credit, 2) }}</td>
                    <td class="text-right">
                        {{ number_format(abs($runningBalance), 2) }} ({{ $runningBalance >= 0 ? 'Dr' : 'Cr' }})
                    </td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="5" class="text-right"><strong>Total</strong></td>
                <td class="text-right"><strong>{{ number_format($totalDebit, 2) }}</strong></td>
                <td class="text-right"><strong>{{ number_format($totalCredit, 2) }}</strong></td>
                <td class="text-right"><strong>{{ number_format(abs($runningBalance), 2) }} ({{ $runningBalance >= 0 ? 'Dr' : 'Cr' }})</strong></td>
            </tr>
        </tfoot>
    </table>
</body>
</html>
