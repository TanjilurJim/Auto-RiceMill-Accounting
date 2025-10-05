import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Copy, Delete } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Calculator() {
    const [display, setDisplay] = useState('0');
    const [firstValue, setFirstValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);
    const [copied, setCopied] = useState(false);
    const [pressedKey, setPressedKey] = useState<string | null>(null);
    const [expression, setExpression] = useState('');
    const [error, setError] = useState(false);
    const [memory, setMemory] = useState(0);

    /* ───────── helpers ───────── */
    const button = (extra = '') =>
        cn('h-12 w-12 rounded-2xl text-xl font-semibold shadow-lg transition-all duration-150 hover:shadow-xl active:scale-95', extra);

    // Add thousand separators to display
    const formatDisplay = (value: string) => {
        if (error) return value;
        if (value.includes('.')) {
            const [int, dec] = value.split('.');
            return `${addCommas(int)}.${dec}`;
        }

        return addCommas(value);
    };

    const addCommas = (numStr: string) => {
        if (numStr.startsWith('-')) {
            return '-' + addCommas(numStr.slice(1));
        }
        return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const inputDigit = (d: string) => {
        if (error) {
            clearAll();
            setDisplay(d);
            return;
        }

        // Prevent excessively long numbers
        if (display.replace('-', '').replace('.', '').length >= 12) return;

        if (waitingForSecondValue) {
            // append after the operator instead of replacing
            setDisplay((prev) => prev + d); // → now shows 5 + 6
            setWaitingForSecondValue(false);
        } else {
            setDisplay((prev) => (prev === '0' ? d : prev + d));
        }
    };

    const inputDecimal = () => {
        if (error) {
            clearAll();
            setDisplay('0.');
            return;
        }

        if (waitingForSecondValue) {
            setDisplay((prev) => prev + '0.');
            setWaitingForSecondValue(false);
        } else if (!display.slice(display.lastIndexOf(' ')).includes('.')) {
            setDisplay(display + '.');
        }
    };

    const clearAll = () => {
        setDisplay('0');
        setFirstValue(null);
        setOperator(null);
        setWaitingForSecondValue(false);
        setExpression('');
        setError(false);
    };

    const backspace = () => {
        if (error) {
            clearAll();
            return;
        }

        if (display.length > 1) {
            setDisplay((prev) => prev.slice(0, -1));
        } else {
            setDisplay('0');
        }
    };

    // Toggle positive/negative
    const toggleSign = () => {
        if (error || waitingForSecondValue) return;

        if (display === '0') {
            setDisplay('-');
        } else if (display.startsWith('-')) {
            setDisplay(display.slice(1));
        } else {
            setDisplay('-' + display);
        }
    };

    // Convert to percentage
    const percentage = () => {
        if (error) return;

        const value = parseFloat(display) / 100;
        setDisplay(value.toString());
    };

    /* arithmetic */
    const operate = (nextOp: string) => {
        if (error) return;

        const opSymbol = getOperatorSymbol(nextOp);

        /* ─── 1. user taps + and then × before typing the 2nd number ─── */
        if (waitingForSecondValue && nextOp !== '=') {
            // replace the last operator in both display & expression
            setDisplay((prev) => prev.trim().replace(/[\+\−×÷]$/, opSymbol) + ' ');
            setExpression((prev) => prev.trim().replace(/[\+\−×÷]$/, opSymbol));
            setOperator(nextOp);
            return;
        }

        const input = parseFloat(
            display // "5 + 6 "
                .split(/[\+\−×÷]/) // → ["5 ", " 6 "]
                .pop()! // → " 6 "
                .trim(), // → "6"
        );

        // Handle division by zero
        if (operator === '/' && input === 0) {
            setDisplay('Error');
            setFirstValue(null);
            setOperator(null);
            setWaitingForSecondValue(false);
            setExpression(`${firstValue} ÷ 0 =`);
            setError(true);
            return;
        }

        if (firstValue == null) {
            setFirstValue(input);

            if (nextOp !== '=') {
                setDisplay(`${formatDisplay(input.toString())} ${opSymbol} `);
                setExpression(`${formatDisplay(input.toString())} ${opSymbol}`);
            }
        } /* ─── 4. we already had a firstValue + operator → calculate ─── */ else if (operator) {
            const result = calc(firstValue, input, operator);
            const resultStr = formatResult(result);

            if (nextOp === '=') {
                setDisplay(resultStr); // show 11
                setExpression(`${expression} ${formatDisplay(input.toString())} =`);
            } else {
                setDisplay(`${resultStr} ${opSymbol} `); // chain ops
                setExpression(`${formatDisplay(resultStr)} ${opSymbol}`);
            }

            setFirstValue(result); // keeps running total for 5 + 6 × 3 …
        }

        setWaitingForSecondValue(nextOp !== '=');
        setOperator(nextOp === '=' ? null : nextOp);
    };

    const calc = (a: number, b: number, op: string) => {
        switch (op) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                return b !== 0 ? a / b : a;
            default:
                return b;
        }
    };

    const formatResult = (result: number) => {
        if (result % 1 === 0) {
            return result.toString();
        }
        return parseFloat(result.toFixed(10)).toString();
    };

    const getOperatorSymbol = (op: string) => {
        switch (op) {
            case '+':
                return '+';
            case '-':
                return '−';
            case '*':
                return '×';
            case '/':
                return '÷';
            default:
                return op;
        }
    };

    /* memory functions */
    const memoryClear = () => setMemory(0);
    const memoryRecall = () => {
        if (!error) setDisplay(memory.toString());
    };
    const memoryAdd = () => {
        if (!error) setMemory((m) => m + parseFloat(display));
    };
    const memorySubtract = () => {
        if (!error) setMemory((m) => m - parseFloat(display));
    };

    /* copy to clipboard */
    const copyValue = async () => {
        const text = display;

        /* A. modern path – works on HTTPS / localhost */
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                flashCopied();
                return;
            } catch {
                /* fall through */
            }
        }

        /* B. fallback – create a hidden textarea */
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed'; // avoid scrolling on iOS
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();

            const succeeded = document.execCommand('copy');
            document.body.removeChild(ta);

            if (succeeded) {
                flashCopied(); // ✅ only when it really worked
            } else {
                alert('Copy failed – your browser blocked access to the clipboard.');
            }
        } catch {
            alert('Copy failed – your browser blocked access to the clipboard.');
        }
    };

    /* nice green flash */
    const flashCopied = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 800);
    };

    /* visual feedback for key press */
    const showKeyPress = (key: string) => {
        setPressedKey(key);
        setTimeout(() => setPressedKey(null), 150);
    };

    /* ───────── keyboard support ───────── */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const handledKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', 'Escape', '+', '-', '*', '/', '=', 'Enter', '%'];

            if (handledKeys.includes(e.key) || (e.ctrlKey && e.key === 'c')) {
                e.preventDefault();

                if (e.ctrlKey && e.key.toLowerCase() === 'c') {
                    showKeyPress('copy');
                    return copyValue();
                }

                if (/^\d$/.test(e.key)) {
                    showKeyPress(e.key);
                    return inputDigit(e.key);
                }
                if (e.key === '.') {
                    showKeyPress('.');
                    return inputDecimal();
                }
                if (e.key === 'Backspace') {
                    showKeyPress('backspace');
                    return backspace();
                }
                if (e.key === 'Escape') {
                    showKeyPress('clear');
                    return clearAll();
                }
                if (['+', '-', '*', '/'].includes(e.key)) {
                    showKeyPress(e.key);
                    return operate(e.key);
                }
                if (e.key === 'Enter' || e.key === '=') {
                    showKeyPress('=');
                    return operate('=');
                }
                if (e.key === '%') {
                    showKeyPress('%');
                    return percentage();
                }
            }

            // Negative sign support
            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                showKeyPress('±');
                toggleSign();
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [
        display,
        firstValue,
        operator,
        waitingForSecondValue,
        expression,
        error,
        backspace,
        copyValue,
        inputDecimal,
        inputDigit,
        operate,
        percentage,
        toggleSign,
    ]);

    /* ───────── UI ───────── */
    return (
        <div className="flex items-center justify-center">
            <div className=" space-y-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl">
                {/* expression history */}
                {/* <div className="min-h-[24px] text-right font-mono text-sm text-slate-400" aria-live="polite">
                {expression || ' '}
            </div> */}

                {/* display */}
                <div className="mt-4 rounded-2xl border border-slate-700/50 bg-slate-950/50 p-6 text-right backdrop-blur-sm">
                    <div className={cn('text-5xl leading-tight font-light break-all text-white', error && 'text-red-400')}>
                        {formatDisplay(display)}
                    </div>
                </div>

                {/* quick actions */}
                <div className="mr-3 flex items-center justify-end">
                    {/* <div className="text-sm text-slate-400">{memory !== 0 && `M: ${memory}`}</div> */}

                    <div className="">
                        <Button
                            onClick={copyValue}
                            size="icon"
                            className={cn(
                                'h-12 w-12 rounded-xl border border-slate-600 bg-slate-700 transition-all duration-150 hover:bg-slate-600',
                                pressedKey === 'copy' && 'scale-95 bg-slate-600',
                                copied && 'bg-green-600 hover:bg-green-500',
                            )}
                            title="Copy result (Ctrl+C)"
                            aria-label="Copy result"
                        >
                            {copied ? <Check className="animate-ping-once h-5 w-5" /> : <Copy className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* keypad */}
                <div className="grid grid-cols-4 justify-items-center gap-3">
                    <Button
                        onClick={clearAll}
                        className={cn(
                            button('border border-red-500 bg-red-600 text-white hover:bg-red-500'),
                            pressedKey === 'clear' && 'scale-95 bg-red-500',
                        )}
                        aria-label="All clear"
                    >
                        AC
                    </Button>
                    <Button
                        onClick={backspace}
                        className={cn(
                            button('border border-slate-500 bg-slate-600 text-white hover:bg-slate-500'),
                            pressedKey === 'backspace' && 'scale-95 bg-slate-500',
                        )}
                        aria-label="Backspace"
                    >
                        <Delete className="h-6 w-6" />
                    </Button>
                    <Button
                        onClick={percentage}
                        className={cn(
                            button('border border-violet-500 bg-violet-600 text-white hover:bg-violet-500'),
                            pressedKey === '%' && 'scale-95 bg-violet-500',
                        )}
                        aria-label="Percentage"
                    >
                        %
                    </Button>
                    <Button
                        onClick={() => operate('/')}
                        className={cn(
                            button('border border-amber-400 bg-amber-500 text-white hover:bg-amber-400'),
                            pressedKey === '/' && 'scale-95 bg-amber-400',
                        )}
                        aria-label="Divide"
                    >
                        ÷
                    </Button>

                    {['7', '8', '9'].map((n) => (
                        <Button
                            key={n}
                            onClick={() => inputDigit(n)}
                            className={cn(
                                button('border border-slate-600 bg-slate-700 text-white hover:bg-slate-600'),
                                pressedKey === n && 'scale-95 bg-slate-600',
                            )}
                            aria-label={`Digit ${n}`}
                        >
                            {n}
                        </Button>
                    ))}
                    <Button
                        onClick={() => operate('*')}
                        className={cn(
                            button('border border-amber-400 bg-amber-500 text-white hover:bg-amber-400'),
                            pressedKey === '*' && 'scale-95 bg-amber-400',
                        )}
                        aria-label="Multiply"
                    >
                        ×
                    </Button>

                    {['4', '5', '6'].map((n) => (
                        <Button
                            key={n}
                            onClick={() => inputDigit(n)}
                            className={cn(
                                button('border border-slate-600 bg-slate-700 text-white hover:bg-slate-600'),
                                pressedKey === n && 'scale-95 bg-slate-600',
                            )}
                            aria-label={`Digit ${n}`}
                        >
                            {n}
                        </Button>
                    ))}
                    <Button
                        onClick={() => operate('-')}
                        className={cn(
                            button('border border-amber-400 bg-amber-500 text-white hover:bg-amber-400'),
                            pressedKey === '-' && 'scale-95 bg-amber-400',
                        )}
                        aria-label="Subtract"
                    >
                        −
                    </Button>

                    {['1', '2', '3'].map((n) => (
                        <Button
                            key={n}
                            onClick={() => inputDigit(n)}
                            className={cn(
                                button('border border-slate-600 bg-slate-700 text-white hover:bg-slate-600'),
                                pressedKey === n && 'scale-95 bg-slate-600',
                            )}
                            aria-label={`Digit ${n}`}
                        >
                            {n}
                        </Button>
                    ))}
                    <Button
                        onClick={() => operate('+')}
                        className={cn(
                            button('border border-amber-400 bg-amber-500 text-white hover:bg-amber-400'),
                            pressedKey === '+' && 'scale-95 bg-amber-400',
                        )}
                        aria-label="Add"
                    >
                        +
                    </Button>

                    <Button
                        onClick={toggleSign}
                        className={cn(
                            button('border border-slate-600 bg-slate-700 text-white hover:bg-slate-600'),
                            pressedKey === '±' && 'scale-95 bg-slate-600',
                        )}
                        aria-label="Toggle sign"
                    >
                        ±
                    </Button>
                    <Button
                        onClick={() => inputDigit('0')}
                        className={cn(
                            button('border border-slate-600 bg-slate-700 text-white hover:bg-slate-600'),
                            pressedKey === '0' && 'scale-95 bg-slate-600',
                        )}
                        aria-label="Digit zero"
                    >
                        0
                    </Button>
                    <Button
                        onClick={inputDecimal}
                        className={cn(
                            button('border border-slate-600 bg-slate-700 text-white hover:bg-slate-600'),
                            pressedKey === '.' && 'scale-95 bg-slate-600',
                        )}
                        aria-label="Decimal point"
                    >
                        .
                    </Button>
                    <Button
                        onClick={() => operate('=')}
                        className={cn(
                            button('border border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-500'),
                            pressedKey === '=' && 'scale-95 bg-emerald-500',
                        )}
                        aria-label="Equals"
                    >
                        =
                    </Button>
                </div>
            </div>
        </div>
    );
}
