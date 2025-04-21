<?php
use PHPUnit\Framework\TestCase;

class HelloWorldTest extends TestCase
{
    public function testHelloWorld()
    {
        $this->assertEquals('Hello, World!', helloWorld());
    }
}
?>

<?xml version="1.0" encoding="UTF-8"?>
<phpunit>
    <testsuites>
        <testsuite name="Unit Tests">
            <directory>./tests/Unit</directory>
        </testsuite>
    </testsuites>
</phpunit>