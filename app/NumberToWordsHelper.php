<?php
// app/Helpers/NumberToWordsHelper.php  (no namespace)

if (! function_exists('number_to_words_bd')) {
    function number_to_words_bd(float|int|string $amount): string
    {
        $isNegative = (float)$amount < 0;
        $normalized = number_format(abs((float)$amount), 2, '.', '');
        [$takaStr, $paisaStr] = explode('.', $normalized);

        $taka   = (int) $takaStr;
        $paisa  = (int) $paisaStr;

        $takaWords  = $taka  ? _bd_number_to_words($taka)  : 'zero';
        $paisaWords = $paisa ? _bd_number_to_words($paisa) : '';

        $main = $paisa
            ? sprintf('%s Taka and %s Paisa only', ucfirst($takaWords), $paisaWords)
            : sprintf('%s Taka only', ucfirst($takaWords));

        return $isNegative ? 'Minus ' . $main : $main;
    }

    function _bd_number_to_words(int $n): string
    {
        $ones = [0=>'',1=>'one',2=>'two',3=>'three',4=>'four',5=>'five',6=>'six',7=>'seven',8=>'eight',9=>'nine',10=>'ten',
                 11=>'eleven',12=>'twelve',13=>'thirteen',14=>'fourteen',15=>'fifteen',16=>'sixteen',17=>'seventeen',18=>'eighteen',19=>'nineteen'];
        $tens = [2=>'twenty',3=>'thirty',4=>'forty',5=>'fifty',6=>'sixty',7=>'seventy',8=>'eighty',9=>'ninety'];
        $scales = [10000000=>'crore',100000=>'lakh',1000=>'thousand',100=>'hundred'];

        if ($n < 20) return $ones[$n];
        if ($n < 100) {
            $t = intdiv($n, 10); $r = $n % 10;
            return trim($tens[$t] . ($r ? ' ' . $ones[$r] : ''));
        }
        foreach ($scales as $divisor => $label) {
            if ($n >= $divisor) {
                $head = intdiv($n, $divisor); $tail = $n % $divisor;
                $str = _bd_number_to_words($head) . " $label";
                if ($tail) $str .= ($tail < 100 ? ' and ' : ' ') . _bd_number_to_words($tail);
                return trim($str);
            }
        }
        return (string)$n;
    }
}
