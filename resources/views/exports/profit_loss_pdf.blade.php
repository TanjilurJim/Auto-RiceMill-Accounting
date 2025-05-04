{{--  Profit & Loss – PDF view  --}}
@php
    /* -------------------------------------------------------
       Helpers
    ------------------------------------------------------- */
    $currency = '৳';                 // Change to your default currency
    $fmt      = fn($v) => number_format($v, 2);
    /*  Build local logo path for Dompdf (remote URLs require isRemoteEnabled) */
    $logoPath = $company?->logo_path ?? $company?->logo_thumb_path ?? null;
    $logoFile = $logoPath ? public_path("storage/{$logoPath}") : null;
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Profit &amp; Loss Report</title>

    {{-- ------------- Minimal, print‑friendly styling ------------- --}}
    <style>
        @page      { margin:18mm 15mm; }
        *          { font-family: DejaVu Sans, sans-serif; line-height:1.35; }
        body       { font-size:12px; color:#111827; }
        h1,h2      { margin:0; font-weight:700; }
        h1         { font-size:20px; }
        h2         { font-size:16px; margin-top:24px; }
        table      { width:100%; border-collapse:collapse; margin-top:6px; }
        th,td      { border:1px solid #E5E7EB; padding:6px 8px; }
        th         { background:#F3F4F6; text-align:left; font-weight:600; }
        .right     { text-align:right; }
        .tot       { background:#ECFDF5; color:#047857; font-weight:700; }
        .company   { text-align:center; margin-bottom:14px; }
        .company img { max-height:60px; margin-bottom:6px; }
        .footer    { margin-top:24px; font-size:10px; color:#6B7280; text-align:center; }
    </style>
</head>
<body>

{{-- ---------- Company header ---------- --}}
<div class="company">
    @if ($logoFile && file_exists($logoFile))
        <img src="file://{{ str_replace('\\','/',$logoFile) }}" alt="Logo">
    @endif

    <h1>{{ $company->company_name ?? 'Company' }}</h1>
    @isset($company->address) <div>{{ $company->address }}</div> @endisset
    @isset($company->phone)   <div>Phone: {{ $company->phone }}</div> @endisset
    @isset($company->email)   <div>Email: {{ $company->email }}</div> @endisset
</div>

{{-- ---------- Report title ---------- --}}
<h2 style="text-align:center">
    Profit &amp; Loss Report<br>
    <small>Period {{ $from_date }} &rarr; {{ $to_date }}</small>
</h2>

{{-- ---------- Figures ---------- --}}
@php
    $rows = [
        ['Income',   [['Sales', $figures['sales']], ['Other Income', $figures['otherIncome']]]],
        ['Expenses', [['Cost of Goods Sold', $figures['cogs']], ['Operating Expenses', $figures['expenses']]]],
        ['Summary',  [['Gross Profit', $figures['grossProfit']], ['Net Profit', $figures['netProfit'], 'tot']]],
    ];
@endphp

@foreach ($rows as [$section, $lines])
    <h2>{{ $section }}</h2>
    <table>
        @foreach ($lines as $row)
            @php
                [$label, $val] = $row;      // first two are always present
                $cls = $row[2] ?? '';       // third = extra class (e.g. 'tot')
            @endphp
            <tr class="{{ $cls }}">
                <td>{{ $label }}</td>
                {{-- normal space, NOT NBSP, so DejaVu Sans has a glyph --}}
                <td class="right">{{ $currency }} {{ $fmt($val) }}</td>
            </tr>
        @endforeach
    </table>
@endforeach

{{-- ---------- Optional per‑ledger breakdown ---------- --}}
@if(count($byLedger))
    <h2>Ledger Breakdown</h2>
    <table>
        <thead>
            <tr>
                <th>Ledger</th>
                <th>Type</th>
                <th class="right">Debits&nbsp;({{ $currency }})</th>
                <th class="right">Credits&nbsp;({{ $currency }})</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($byLedger as $r)
                <tr>
                    <td>{{ $r['ledger'] }}</td>
                    <td>{{ ucfirst($r['type'] ?? '-') }}</td>
                    <td class="right">{{ $fmt($r['debits']) }}</td>
                    <td class="right">{{ $fmt($r['credits']) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endif

<div class="footer">
    Generated {{ now()->format('d M Y H:i') }} by {{ auth()->user()->name ?? 'System' }}
</div>

</body>
</html>
