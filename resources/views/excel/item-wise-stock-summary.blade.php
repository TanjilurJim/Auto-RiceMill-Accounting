<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Item</th>
            <th>Unit</th>
            <th>Qty</th>
            <th>Purchase</th>
            <th>Sale</th>
            <th>Sale Qty</th>
            <th>Last Purchase</th>
            <th>Purchase Qty</th>
            <th>Last Sale</th>
            <th>Sale Qty</th>
        </tr>
    </thead>
    <tbody>
        @foreach($items as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $item['item_name'] }}</td>
                <td>{{ $item['unit'] }}</td>
                <td>{{ number_format($item['total_qty'], 2) }}</td>
                <td>{{ number_format($item['total_purchase'], 2) }}</td>
                <td>{{ number_format($item['total_sale'], 2) }}</td>
                <td>{{ number_format($item['total_sale_qty'], 2) }}</td>
                <td>{{ optional($item['last_purchase_at'])->format('d-m-Y') ?? '-' }}</td>
                <td>{{ number_format($item['last_purchase_qty'], 2) }}</td>
                <td>{{ optional($item['last_sale_at'])->format('d-m-Y') ?? '-' }}</td>
                <td>{{ number_format($item['last_sale_qty'], 2) }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
