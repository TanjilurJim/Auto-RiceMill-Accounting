@php
    $appName = config('app.name', 'RiceMillERP');
    $effective = now()->toDateString();
    
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Privacy Policy — {{ $appName }}</title>

    {{-- If you compile Tailwind via Vite, include your CSS bundle here. --}}
    {{-- @vite(['resources/css/app.css']) --}}
    <script src="https://cdn.tailwindcss.com"></script>

    {{-- Optional: favicon --}}
    <link rel="icon" href="{{ asset('favicon.ico') }}">
</head>
<body class="min-h-full bg-background text-foreground antialiased">
    <main class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <header class="mb-8 border-b pb-6">
            <h1 class="text-3xl font-bold">Privacy Policy</h1>
            <p class="mt-2 text-sm text-muted-foreground">
                Effective date: <span class="font-medium">{{ \Illuminate\Support\Carbon::parse($effective)->format('d M Y') }}</span>
            </p>

            
        </header>

        <section class="mb-8 rounded-lg border bg-card p-4">
            <h2 class="text-lg font-semibold">Summary</h2>
            <ul class="mt-3 list-inside list-disc text-sm leading-6 text-muted-foreground">
                <li>We collect only what we need to operate {{ $appName }} (e.g., account, ledger, inventory, purchase/sales and production data).</li>
                <li>We use the data to provide the service, maintain security, comply with law, and improve features.</li>
                <li>We do not sell your personal data.</li>
                <li>You control your data: access, correct, export, or delete (subject to legal/record-keeping obligations).</li>
            </ul>
        </section>

        <nav class="mb-10">
            <h2 class="sr-only">Contents</h2>
            <ol class="grid gap-2 text-sm md:grid-cols-2">
                <li><a class="text-primary hover:underline" href="#what-we-collect">1. Information We Collect</a></li>
                <li><a class="text-primary hover:underline" href="#how-we-use">2. How We Use Information</a></li>
                <li><a class="text-primary hover:underline" href="#legal-bases">3. Legal Bases</a></li>
                <li><a class="text-primary hover:underline" href="#sharing">4. Sharing & Disclosures</a></li>
                <li><a class="text-primary hover:underline" href="#retention">5. Data Retention</a></li>
                <li><a class="text-primary hover:underline" href="#security">6. Security</a></li>
                <li><a class="text-primary hover:underline" href="#transfers">7. International Transfers</a></li>
                <li><a class="text-primary hover:underline" href="#rights">8. Your Rights</a></li>
                <li><a class="text-primary hover:underline" href="#cookies">9. Cookies & Tracking</a></li>
                <li><a class="text-primary hover:underline" href="#third-parties">10. Third-Party Services</a></li>
                <li><a class="text-primary hover:underline" href="#children">11. Children’s Privacy</a></li>
                <li><a class="text-primary hover:underline" href="#changes">12. Changes to this Policy</a></li>
                <li><a class="text-primary hover:underline" href="#contact">13. Contact Us</a></li>
            </ol>
        </nav>

        <article class="prose prose-sm max-w-none dark:prose-invert">
            <h2 id="what-we-collect">1. Information We Collect</h2>
            <p>Depending on how you use {{ $appName }}, we may collect:</p>
            <ul>
                <li><strong>Account & Profile:</strong> name, email, phone, company details, roles and permissions.</li>
                <li><strong>Operational Data:</strong> ledgers, journals, vouchers, inventory, lots/weights, purchases, sales, production runs, shipments, and related attachments/notes.</li>
                <li><strong>Device/Usage:</strong> log data (IP, browser, timestamps), error reports, and security events.</li>
                <li><strong>Payments/Billing (if applicable):</strong> billing address, transaction references (processed by our payment providers; we do not store full card details).</li>
                <li><strong>Support:</strong> messages, tickets, and feedback you send us.</li>
            </ul>

            <h2 id="how-we-use">2. How We Use Information</h2>
            <ul>
                <li>Provide and maintain the ERP features (accounting, inventory, production, reporting).</li>
                <li>Authenticate users, enforce access controls, and keep the service secure.</li>
                <li>Generate reports you request and support audit/compliance requirements.</li>
                <li>Improve performance, fix bugs, and develop new features.</li>
                <li>Communicate about service updates, security notices, and support.</li>
                <li>Comply with legal obligations and enforce our terms.</li>
            </ul>

            <h2 id="legal-bases">3. Legal Bases</h2>
            <p>Where applicable (e.g., GDPR), we rely on: (a) performance of a contract, (b) legitimate interests (service operation, security, improvement), (c) consent (where required), and (d) compliance with legal obligations.</p>

            <h2 id="sharing">4. Sharing & Disclosures</h2>
            <ul>
                <li><strong>Service Providers:</strong> hosting, storage, analytics, email/SMS, and payment processors who process data on our behalf under data-processing terms.</li>
                <li><strong>Compliance & Safety:</strong> if required by law, legal process, or to protect rights, safety, and security.</li>
                <li><strong>Business Transfers:</strong> in connection with a merger, acquisition, or asset sale; we’ll notify you if your data becomes subject to a different policy.</li>
            </ul>
            <p>We do not sell personal data.</p>

            <h2 id="retention">5. Data Retention</h2>
            <p>Operational and financial records may be retained for as long as your account is active and thereafter as required for legal, audit, and compliance purposes. We also retain logs for security and troubleshooting for a limited period. When no longer needed, data is securely deleted or anonymized.</p>

            <h2 id="security">6. Security</h2>
            <p>We use administrative, technical, and physical safeguards appropriate to the risk (e.g., access controls, encryption in transit, backups). No method of transmission or storage is 100% secure; we continually improve our protections.</p>

            <h2 id="transfers">7. International Transfers</h2>
            <p>Where data crosses borders, we take steps to ensure appropriate safeguards (e.g., contractual clauses) consistent with applicable law.</p>

            <h2 id="rights">8. Your Rights</h2>
            <ul>
                <li>Access, correct, update, or delete your data, subject to legal/record-keeping obligations.</li>
                <li>Object to or restrict certain processing, and request data portability (where applicable).</li>
                <li>Withdraw consent where processing is based on consent.</li>
                <li>Lodge a complaint with a supervisory authority if you believe your rights are infringed.</li>
            </ul>
            <p>To exercise rights, contact us at the address below; we may need to verify your identity.</p>

            <h2 id="cookies">9. Cookies & Tracking</h2>
            <p>We use essential cookies for authentication and session management, and (optionally) analytics cookies to understand usage trends. You can control cookies via your browser settings; blocking some cookies may impact functionality.</p>

            <h2 id="third-parties">10. Third-Party Services</h2>
            <p>{{ $appName }} may integrate with third-party services (e.g., analytics, communications, payment gateways). Your use of those services is subject to their privacy policies.</p>

            <h2 id="children">11. Children’s Privacy</h2>
            <p>{{ $appName }} is not directed to children and is intended for business use. We do not knowingly collect personal data from children.</p>

            <h2 id="changes">12. Changes to this Policy</h2>
            <p>We may update this policy to reflect changes in technology, law, or our services. We’ll post updates here and adjust the “Effective date” above. For material changes, we may provide additional notice.</p>

            <h2 id="contact">13. Contact Us</h2>
            <p>If you have questions or requests about this policy or your data, contact:</p>
            <ul>
                <li><strong>{{ $co->company_name ?? $appName }}</strong></li>
                @if(!empty($co->address)) <li>{{ $co->address }}</li> @endif
                @if(!empty($co->phone))   <li>Phone: {{ $co->phone }}</li> @endif
                @if(!empty($co->email))   <li>Email: <a class="text-primary hover:underline" href="mailto:{{ $co->email }}">{{ $co->email }}</a></li> @endif
            </ul>
        </article>

        <footer class="mt-12 border-t pt-6 text-xs text-muted-foreground">
            © {{ date('Y') }} {{ $co->company_name ?? $appName }}. All rights reserved.
        </footer>
    </main>
</body>
</html>
