<?php

// use NumberFormatter;

if (!function_exists('numberToWords')) {
    function numberToWords($number)
    {
        $f = new NumberFormatter("en", NumberFormatter::SPELLOUT);
        return ucfirst($f->format($number)) . ' only';
    }
}

