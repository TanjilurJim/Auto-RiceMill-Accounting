<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Day Book PDF</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #f0f0f0;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }
    </style>
</head>

<body>
    <h2 class="text-center">{{ $company->company_name ?? 'Company Name' }}</h2>
    <p class="text-center">Day Book Report</p>
    <p class="text-center">
        From: {{ $filters['from'] ?? ($filters['from_date'] ?? '-') }} —
        To: {{ $filters['to'] ?? ($filters['to_date'] ?? '-') }}
    </p>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Voucher No</th>
                <th>Ledger</th>
                <th>Created By</th>
                <th class="text-right">Debit (Tk)</th>
                <th class="text-right">Credit (Tk)</th>
                <th>Note</th>
            </tr>
        </thead>
        <tbody>
            @forelse($entries as $entry)
                <tr>
                    <td>{{ $entry['date'] }}</td>
                    <td>{{ $entry['type'] }}</td>
                    <td>{{ $entry['voucher_no'] }}</td>
                    <td>{{ $entry['ledger'] }}</td>
                    <td>{{ $entry['created_by'] ?? '-' }}</td>
                    <td class="text-right">{{ number_format($entry['debit'], 2) }}</td>
                    <td class="text-right">{{ number_format($entry['credit'], 2) }}</td>
                    <td>{{ $entry['note'] ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="text-center">No records found.</td>
                </tr>
            @endforelse

            @if ($entries->isNotEmpty())
                <tr style="background-color: #f0f0f0; font-weight: bold;">
                    <td colspan="5" class="text-right">Total</td>
                    <td class="text-right">
                        {{ number_format($entries->sum('debit'), 2) }}
                    </td>
                    <td class="text-right">
                        {{ number_format($entries->sum('credit'), 2) }}
                    </td>
                    <td></td>
                </tr>
            @endif

        </tbody>
    </table>
</body>

</html>
