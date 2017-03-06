# locm3-tools

This webpage is a collection of useful tools for configuring STM32 processors in [libopencm3](https://github.com/libopencm3/libopencm3).

## Calculations
All calculations taken from reference manual RM0090 for STM32F405xx/07xx, STM32F415xx/17xx, STM32F42xxx, and STM32F43xxx.

- `PLLin = HSE with 4 <= PLLin <= 26`
- `VCOin = PLLin / PLLM with 1MHz <= VCOin <= 2MHz`
- `VCOout = VCOin × PLLN with 100MHz <= VCOout <= 432MHz`
- `PLLout = VCOout * PLLP with PLLout <= 168MHz`
- `AHB = PLLout / HPRE with AHB <= 168MHz`
- `APB1 = PLLout / PPRE1 with APB1 <= 42MHz`
- `APB2 = PLLout / PPRE2 with APB2 <= 84MHz`
