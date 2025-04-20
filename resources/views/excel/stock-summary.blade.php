<table>
    <thead>
        <tr>
            <th>#</th><th>Item</th><th>Godown</th><th>Qty (Unit)</th>
            <th>Purchased</th><th>Sold</th><th>Last Purchase</th><th>Last Sale</th>
        </tr>
    </thead>
    <tbody>
        @foreach($stocks as $stock)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $stock['item_name'] }}</td>
                <td>{{ $stock['godown_name'] }}</td>
                <td>{{ number_format($stock['qty'], 2) }} ({{ $stock['unit'] }})</td>
                <td>{{ number_format($stock['total_purchase'], 2) }}</td>
                <td>{{ number_format($stock['total_sale'], 2) }}</td>
                <td>{{ optional($stock['last_purchase_at'])->format('d-m-Y') }}</td>
                <td>{{ optional($stock['last_sale_at'])->format('d-m-Y') }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
