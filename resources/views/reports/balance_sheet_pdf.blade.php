@php
    $logoPath = $company['logo_path'] ?? ($company['logo_thumb_path'] ?? null);
    $logoFile = $logoPath ? public_path("storage/{$logoPath}") : null;
@endphp

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Balance Sheet</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
            margin: 0 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header img {
            height: 70px;
            object-fit: contain;
            margin-bottom: 10px;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
        }

        .subtitle {
            font-size: 12px;
            margin-top: 4px;
        }

        .section-title {
            background: #f0f0f0;
            padding: 6px;
            font-weight: bold;
        }

        .row {
            display: flex;
            justify-content: space-between;
            padding: 4px 6px;
            border-bottom: 1px solid #ddd;
        }

        .row.total-asset {
            background: #e6f5e6;
            font-weight: bold;
        }

        .row.total-liab {
            background: #fbeaea;
            font-weight: bold;
        }

        .row.stock-row {
            border-top: 1px solid #aaa;
        }

        .container {
            display: flex;
            gap: 20px;
        }

        .column {
            flex: 1;
            border: 1px solid #ccc;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            font-weight: bold;
            color: red;
        }
    </style>
</head>

<body>

    <div class="header">
        @if ($logoFile && file_exists($logoFile))
            <img src="file://{{ str_replace('\\', '/', $logoFile) }}" alt="Logo"
                style="max-height: 60px; margin-bottom: 10px;">
        @endif

        <div class="title">{{ $company['company_name'] ?? 'Company Name' }}</div>

        @if ($company['address'])
            <div>{{ $company['address'] }}</div>
        @endif
        @if ($company['phone'])
            <div>Phone: {{ $company['phone'] }}</div>
        @endif
        @if ($company['email'])
            <div>Email: {{ $company['email'] }}</div>
        @endif

        <div class="subtitle">
            Balance Sheet &nbsp; <strong>{{ $from_date }}</strong> → <strong>{{ $to_date }}</strong>
        </div>
    </div>

    <div class="container">
        <!-- ASSETS COLUMN -->
        <div class="column">
            <div class="section-title">Assets</div>
            @foreach ($balances->where('side', 'asset') as $row)
                <div class="row">
                    <span>{{ $row['group'] }}</span>
                    <span>{{ number_format($row['value'], 2) }}</span>
                </div>
            @endforeach
            <div class="row stock-row">
                <span>Stock Value</span>
                <span>{{ number_format($stock, 2) }}</span>
            </div>
            <div class="row">
                <span>Work‑in‑Process</span>
                <span>{{ number_format($working, 2) }}</span>
            </div>
            <div class="row total-asset">
                <span>Total Assets</span>
                <span>{{ number_format($assetTotal, 2) }}</span>
            </div>
        </div>

        <!-- LIABILITIES COLUMN -->
        <div class="column">
            <div class="section-title">Liabilities & Equity</div>
            @foreach ($balances->where('side', 'liability') as $row)
                <div class="row">
                    <span>{{ $row['group'] }}</span>
                    <span>{{ number_format($row['value'], 2) }}</span>
                </div>
            @endforeach
            <div class="row total-liab">
                <span>Total Liabilities</span>
                <span>{{ number_format($liabTotal, 2) }}</span>
            </div>
        </div>
    </div>

    @if ($difference != 0)
        <div class="footer">
            Difference: {{ number_format($difference, 2) }}
        </div>
    @endif

</body>

</html>
