const USB_FREQ = 48;

var clk = {
  hse: { // HSE = PLLin
    min: 4,
    max: 26
  },
  vcoIn: {
    min: 1,
    max: 2
  },
  vcoOut: {
    min: 100,
    max: 432
  },
  pll: { // PLL = PLLout
    min: 0,
    max: 168
  },
  ahb: { // AHB = HCLK
    min: 0,
    max: 168
  },
  apb1: {
    min: 0,
    max: 42
  },
  apb2: {
    min: 0,
    max: 84
  }
};

var cfg = {
  pllm: {
    min: 2,
    max: 63
  },
  plln: {
    min: 50,
    max: 432
  },
  pllp: {
    arr: [2, 4, 6, 8]
  },
  pllq: {
    min: 2,
    max: 15
  },
  pllr: {
    val: 0
  },
  hpre: {
    arr: [1, 2, 4, 8, 16, 64, 128, 256, 512]
  },
  ppre1: {
    arr: [1, 2, 4, 8, 16]
  },
  ppre2: {
    arr: [1, 2, 4, 8, 16]
  }
};

var vos = {
  1: 168, // Scale 1 mode
  2: 144, // Scale 2 mode
  // 3: 120  // Scale 3 mode (TODO: implement VOS Scale 3 mode)
};

var voltage = {
  min: 1.8,
  max: 3.6
}

var flash = [
  { // 2.7V - 3.6V
    min: 2.7,
    max: 3.6,
    step: 30
  },
  { // 2.4V - 2.7V
    min: 2.4,
    max: 2.7,
    step: 24
  },
  { // 2.1V - 2.4V
    min: 2.1,
    max: 2.4,
    step: 22
  },
  { // 1.8V - 2.1V (Prefetch OFF)
    min: 1.8,
    max: 2.1,
    step: 20
  },
]


function inRange(obj) {
  return obj.val >= obj.min && obj.val <= obj.max;
}

function getHSEConfig() {
  for (clk.vcoIn.val = clk.vcoIn.max; clk.vcoIn.val >= clk.vcoIn.min; clk.vcoIn.val--) {
    cfg.pllm.val = clk.hse.val / clk.vcoIn.val;
    if (cfg.pllm.val === Math.trunc(cfg.pllm.val) && inRange(cfg.pllm)) {
      break;
    } else if (clk.vcoIn.val == 1) {
      return;
    }
  }

  for (cfg.pllp.val of cfg.pllp.arr) {
    clk.vcoOut.val = clk.pll.val * cfg.pllp.val;
    if (inRange(clk.vcoOut)) {
      for (cfg.pllq.val = cfg.pllq.min; cfg.pllq.val < cfg.pllq.max; cfg.pllq.val++) {
        if (USB_FREQ * cfg.pllq.val === clk.vcoOut.val) {
          cfg.plln.val = clk.vcoOut.val / clk.vcoIn.val;
          if (inRange(cfg.plln)) {
            for (let cf in cfg) {
              document.getElementById(cf).textContent = cfg[cf].val;
            }

            for (let cl of ['ahb', 'apb1', 'apb2']) {
              let cf = cl.substr(1).replace('b', 'pre');
              for (let i of cfg[cf].arr) {
                clk[cl].val = clk.pll.val / i;
                if (inRange(clk[cl])) {
                  cfg[cf].val = i;
                  document.getElementById(cf).textContent = `RCC_CFGR_${cf.substr(0, 4).toUpperCase()}_DIV_${i === 1 ? 'NONE' : i}`;
                  document.getElementById(cl).textContent = clk[cl].val * 100000;
                  break;
                }
              }
            }

            document.getElementById('hclk').textContent = clk.ahb.val;
            for (let cl of ['hse', 'vcoIn', 'vcoOut', 'pll']) {
              document.getElementById(cl.replace('vco', 'vco-').toLowerCase())
                .textContent = `${cl.toUpperCase()}: ${clk[cl].val}MHz`;
            }

            for (let v in vos) {
              if (inRange({val: clk.pll.val, min: 0, max: vos[v]})) {
                document.getElementById('input-vos').children[v].removeAttribute('disabled');
                // document.getElementById('input-vos').children[v].setAttribute('selected', '');
              } else {
                document.getElementById('input-vos').children[v].removeAttribute('selected');
                document.getElementById('input-vos').children[v].setAttribute('disabled', '');
                document.getElementById('vos').textContent = ``;
              }
            }

            getFlashConfig();
            return;
          }
        }
      }
    }
  }

  console.log('No valid config possible')
}

function getFlashConfig() {
  for (let r of flash) {
    if (inRange({val: voltage.val, min: r.min, max: r.max})) {
      document.getElementById('flash').textContent =
        `FLASH_ACR_LATENCY_${Math.ceil(clk.pll.val / r.step)}WS`;
      break;
    }
  }
}

function inputClock(e) {
  let v = parseInt(e.target.value);
  let cl = e.target.id.replace('input-', '');

  if (inRange({val: v, min: clk[cl].min, max: clk[cl].max})) {
    clk[cl].val = v;
    getHSEConfig();
  } else if (e.target.value === '') {
    e.target.value = '';
  } else if (isNaN(v) || v > clk[cl].max) {
    e.target.value = clk[cl].val || '';
  }
}


let hseInput = document.getElementById('input-hse');
let pllInput = document.getElementById('input-pll');
let vosInput = document.getElementById('input-vos');
let voltageInput = document.getElementById('input-voltage');

hseInput.value = '';
pllInput.value = '';
vosInput.value = 0;
voltageInput.value = '';

hseInput.addEventListener('input', inputClock);
pllInput.addEventListener('input', inputClock);
vosInput.addEventListener('change', function(e) {
  document.getElementById('vos').textContent = `POWER_SCALE${e.target.value}`;
});
voltageInput.addEventListener('input', function(e) {
  let v = parseFloat(e.target.value);

  if (inRange({val: v, min: voltage.min, max: voltage.max})) {
    voltage.val = v;
    getFlashConfig();
  } else if (e.target.value === '') {
    e.target.value = '';
  } else if (isNaN(v) || v > voltage.max) {
    e.target.value = voltage.val || '';
  }
});
