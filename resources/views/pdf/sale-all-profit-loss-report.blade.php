<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>All Sales Profit & Loss Report</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #000;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 6px 8px;
            text-align: left;
            vertical-align: middle;
            white-space: nowrap;
        }

        th {
            background: #f0f0f0;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .footer {
            margin-top: 30px;
            font-size: 11px;
            text-align: center;
            color: #777;
        }
    </style>
</head>

<body>

    {{-- ─── Company Header ─── --}}
    <div class="text-center">
        <h2 style="margin-bottom:5px;">{{ $company['company_name'] }}</h2>
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

    {{-- ─── Report Title ─── --}}
    <div class="text-center" style="margin-top:10px;">
        <h3 style="text-decoration: underline;">All Sale Profit & Loss Report</h3>
        @if (!empty($filters['year']))
            <p>Showing for Year <strong>{{ $filters['year'] }}</strong></p>
        @else
            <p>From <strong>{{ $filters['from_date'] }}</strong> to <strong>{{ $filters['to_date'] }}</strong></p>
        @endif
    </div>

    {{-- ─── Table ─── --}}
    <table>
        <thead>
            <tr>
                <th>#</th>
                @if (!empty($filters['year']))
                    <th>Month</th>
                    <th class="text-right">Profit (Tk)</th>
                @else
                    <th>Date</th>
                    <th>Voucher No</th>
                    <th>Item</th>
                    <th class="text-right">Qty</th>
                    <th>Unit</th>
                    <th class="text-right">Sale Price</th>
                    <th class="text-right">Cost Price</th>
                    <th class="text-right">Profit</th>
                    <th class="text-right">Profit %</th>
                @endif
            </tr>
        </thead>
        <tbody>
            @php
                $grandProfit = 0;
            @endphp

            @forelse ($entries as $i => $r)
                <tr>
                    <td>{{ $i + 1 }}</td>

                    @if (!empty($filters['year']))
                        <td>{{ \Carbon\Carbon::create()->month($r->month ?? 1)->format('F') }}</td>
                        <td class="text-right">{{ number_format($r->profit ?? 0, 2) }}</td>
                        @php $grandProfit += $r->profit ?? 0; @endphp
                    @else
                        <td>{{ \Carbon\Carbon::parse($r->date)->format('d/m/Y') }}</td>
                        <td>{{ $r->voucher_no }}</td>
                        <td>{{ $r->item_name }}</td>
                        <td class="text-right">{{ number_format($r->qty ?? 0, 2) }}</td>
                        <td>{{ $r->unit_name }}</td>
                        <td class="text-right">{{ number_format($r->sale_price ?? 0, 2) }}</td>
                        <td class="text-right">{{ number_format($r->purchase_price ?? 0, 2) }}</td>
                        <td class="text-right">{{ number_format($r->profit ?? 0, 2) }}</td>
                        <td class="text-right">
                            @if (($r->sale_price ?? 0) > 0)
                                {{ number_format(($r->profit / $r->sale_price) * 100, 2) }}%
                            @else
                                0.00%
                            @endif
                        </td>
                        @php $grandProfit += $r->profit ?? 0; @endphp
                    @endif
                </tr>
            @empty
                <tr>
                    <td colspan="{{ !empty($filters['year']) ? 3 : 10 }}" class="text-center">No data found.</td>
                </tr>
            @endforelse

            {{-- ─── Grand Total Row ─── --}}
            <tr>
                <th colspan="{{ !empty($filters['year']) ? 2 : 8 }}" class="text-right">Grand Total</th>
                <th class="text-right">{{ number_format($grandProfit, 2) }}</th>
                @if (empty($filters['year']))
                    <th></th> {{-- Empty for profit % total --}}
                @endif
            </tr>
        </tbody>
    </table>

    {{-- ─── Footer ─── --}}
    <div class="footer">
        Report generated on {{ \Carbon\Carbon::now()->format('d/m/Y h:i A') }}
    </div>

</body>

</html>
