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
        @foreach($entries as $entry)
            <tr>
                <td>{{ $entry['date'] }}</td>
                <td>{{ $entry['voucher_no'] }}</td>
                <td>{{ $entry['type'] }}</td>
                <td>{{ $entry['ledger'] }}</td>
                <td>{{ $entry['mode_ledger'] }}</td>
                <td>{{ number_format($entry['amount'], 2) }}</td>
                <td>{{ $entry['created_by'] }}</td>
            </tr>
            @php $total += $entry['amount']; @endphp
        @endforeach
        <tr>
            <td colspan="5" style="text-align:right">Total</td>
            <td>{{ number_format($total, 2) }}</td>
            <td></td>
        </tr>
    </tbody>
</table>
