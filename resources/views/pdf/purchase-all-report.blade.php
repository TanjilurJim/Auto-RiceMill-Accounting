<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>All Purchases Report</title>
  <style>
    body { font-family: sans-serif; font-size: 12px; }
    .header { text-align: center; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 16px; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
    th, td { border: 1px solid #333; padding: 4px; }
    th { background-color: #eee; }
    .text-right { text-align: right; }
    .totals { font-weight: bold; background-color: #f5f5f5; }
  </style>
</head>
<body>

  <div class="header">
    <h1>{{ $company->company_name }}</h1>
    @if($company->address) <p>{{ $company->address }}</p> @endif
    @if($company->mobile)  <p>Phone: {{ $company->mobile }}</p> @endif
    @if($company->email)   <p>{{ $company->email }}</p> @endif
    <h2>All Purchases Report</h2>
    <p>
      From <strong>{{ \Carbon\Carbon::parse($filters['from_date'])->format('d-M-Y') }}</strong>
      to   <strong>{{ \Carbon\Carbon::parse($filters['to_date'])->format('d-M-Y') }}</strong>
    </p>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Date</th>
        <th>Vch No</th>
        <th>Supplier</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Net (Tk)</th>
        <th class="text-right">Paid (Tk)</th>
        <th class="text-right">Due (Tk)</th>
      </tr>
    </thead>
    <tbody>
      @foreach($entries as $i => $r)
        <tr>
          <td>{{ $i + 1 }}</td>
          <td>{{ \Carbon\Carbon::parse($r->date)->format('d-M-Y') }}</td>
          <td>{{ $r->voucher_no }}</td>
          <td>{{ $r->supplier }}</td>
          <td class="text-right">{{ number_format($r->qty,2) }}</td>
          <td class="text-right">{{ number_format($r->net_amount,2) }}</td>
          <td class="text-right">{{ number_format($r->amount_paid,2) }}</td>
          <td class="text-right">{{ number_format($r->due,2) }}</td>
        </tr>
      @endforeach

      @if($entries->count())
        <tr class="totals">
          <td colspan="4" class="text-right">Grand Total</td>
          <td class="text-right">{{ number_format($entries->sum('qty'),2) }}</td>
          <td class="text-right">{{ number_format($entries->sum('net_amount'),2) }}</td>
          <td class="text-right">{{ number_format($entries->sum('amount_paid'),2) }}</td>
          <td class="text-right">{{ number_format($entries->sum('due'),2) }}</td>
        </tr>
      @endif
    </tbody>
  </table>

  <div style="text-align:center; font-size:10px;">
    Generated on {{ now()->format('d-M-Y H:i') }}
  </div>
</body>
</html>
