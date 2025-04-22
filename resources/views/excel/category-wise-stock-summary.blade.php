<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Category</th>
            <th>Total Qty</th>
            <th>Total Purchase</th>
            <th>Total Sale</th>
            <th>Last Purchase</th>
            <th>Purchase Qty</th>
            <th>Last Sale</th>
            <th>Sale Qty</th>
        </tr>
    </thead>
    <tbody>
        @foreach($categories as $i => $cat)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $cat['category_name'] }}</td>
                <td>{{ number_format($cat['total_qty'], 2) }}</td>
                <td>{{ number_format($cat['total_purchase'], 2) }}</td>
                <td>{{ number_format($cat['total_sale'], 2) }}</td>
                <td>{{ optional($cat['last_purchase_at'])->format('d-m-Y') ?? '-' }}</td>
                <td>{{ number_format($cat['last_purchase_qty'], 2) }} {{ $cat['last_purchase_unit'] ?? '' }}</td>
                <td>{{ optional($cat['last_sale_at'])->format('d-m-Y') ?? '-' }}</td>
                <td>{{ number_format($cat['last_sale_qty'], 2) }} {{ $cat['last_sale_unit'] ?? '' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
