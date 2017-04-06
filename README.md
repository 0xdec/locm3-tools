# locm3-tools

This webpage is a collection of useful tools for configuring STM32 processors in [libopencm3](https://github.com/libopencm3/libopencm3).

## Calculations
All calculations taken from [RM0090](http://www.st.com/resource/en/reference_manual/dm00031020.pdf) for STM32F405xx/07xx, STM32F415xx/17xx, STM32F42xxx, and STM32F43xxx.

- `PLLin = HSE with 4 <= PLLin <= 26`
- `VCOin = PLLin / PLLM with 1MHz <= VCOin <= 2MHz`
- `VCOout = VCOin × PLLN with 100MHz <= VCOout <= 432MHz`
- `PLLout = VCOout * PLLP with PLLout <= 168MHz`
- `AHB = PLLout / HPRE with AHB <= 168MHz`
- `APB1 = PLLout / PPRE1 with APB1 <= 42MHz`
- `APB2 = PLLout / PPRE2 with APB2 <= 84MHz`

<table>
  <caption>Clock Table</caption>
  <thead>
    <tr>
      <th>Wait states (WS)</th>
      <th>2.7V - 3.6V</th>
      <th>2.4V - 2.7V</th>
      <th>2.1V - 2.4V</th>
      <th>1.8V - 2.1V<br>Prefetch OFF</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0 (1 CPU cycle)</td>
      <td>0 < HCLK <= 30</td>
      <td>0 < HCLK <= 24</td>
      <td>0 < HCLK <= 22</td>
      <td>0 < HCLK <= 20</td>
    </tr>
    <tr>
      <td>1 (2 CPU cycles)</td>
      <td>30 < HCLK <= 60</td>
      <td>24 < HCLK <= 48</td>
      <td>22 < HCLK <= 44</td>
      <td>20 < HCLK <= 40</td>
    </tr>
    <tr>
      <td>2 (3 CPU cycles)</td>
      <td>60 < HCLK <= 90</td>
      <td>48 < HCLK <= 72</td>
      <td>44 < HCLK <= 66</td>
      <td>40 < HCLK <= 60</td>
    </tr>
    <tr>
      <td>3 (4 CPU cycles)</td>
      <td>90 < HCLK <= 120</td>
      <td>72 < HCLK <= 96</td>
      <td>66 < HCLK <= 88</td>
      <td>60 < HCLK <= 80</td>
    </tr>
    <tr>
      <td>4 (5 CPU cycles)</td>
      <td>120 < HCLK <= 150</td>
      <td>96 < HCLK <= 120</td>
      <td>88 < HCLK <= 110</td>
      <td>80 < HCLK <= 100</td>
    </tr>
    <tr>
      <td>5 (6 CPU cycles)</td>
      <td>150 < HCLK <= 168</td>
      <td>120 < HCLK <= 144</td>
      <td>110 < HCLK <= 132</td>
      <td>100 < HCLK <= 120</td>
    </tr>
    <tr>
      <td>6 (7 CPU cycles)</td>
      <td></td>
      <td>144 < HCLK <= 168</td>
      <td>132 < HCLK <= 154</td>
      <td>120 < HCLK <= 140</td>
    </tr>
    <tr>
      <td>7 (8 CPU cycles)</td>
      <td></td>
      <td></td>
      <td>154 < HCLK <= 168</td>
      <td>140 < HCLK <= 160</td>
    </tr>
  </tbody>
</table>
