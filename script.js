const products = [
  {
    cn: "王浆粉",
    en: "ROYAL JELLY POWDER",
    pack: "20kg/CTN",
    netPerUnit: 20,
    volumePerUnit: 0.036,
    grossPerUnit: 21.5,
  },
  {
    cn: "鲜王浆",
    en: "FRESH ROYAL JELLY",
    pack: "10kg/CTN",
    netPerUnit: 10,
    volumePerUnit: 0.048,
    grossPerUnit: 12.7,
  },
  {
    cn: "蜂胶粉",
    en: "PROPOLIS POWDER",
    pack: "20kg/CTN",
    netPerUnit: 20,
    volumePerUnit: 0.036,
    grossPerUnit: 21.5,
  },
  {
    cn: "花粉(桶)",
    en: "BEE POLLEN",
    pack: "25kg/DRUM",
    netPerUnit: 25,
    volumePerUnit: 0.058,
    grossPerUnit: 27.5,
  },
  {
    cn: "油菜花粉",
    en: "RAPE POLLEN",
    pack: "25kg/DRUM",
    netPerUnit: 25,
    volumePerUnit: 0.058,
    grossPerUnit: 27.5,
  },
  {
    cn: "红参粉",
    en: "RED GINSENG POWDER",
    pack: "20kg/CTN",
    netPerUnit: 20,
    volumePerUnit: 0.041,
    grossPerUnit: 20,
  },
  {
    cn: "花粉(箱)",
    en: "BEE POLLEN",
    pack: "20kg/CTN",
    netPerUnit: 20,
    volumePerUnit: 0.036,
    grossPerUnit: 21.5,
  },
  {
    cn: "人参纸箱",
    en: "GINSENG",
    pack: "20kg/CTN",
    netPerUnit: 20,
    volumePerUnit: 0.036,
    grossPerUnit: 21.5,
  },
];

const containerProfiles = [
  { name: "20GP", maxVolume: 33.2, maxGross: 28000 },
  { name: "40GP", maxVolume: 67.7, maxGross: 30480 },
  { name: "40HQ", maxVolume: 76.3, maxGross: 30480 },
];

const productsBody = document.getElementById("products-body");
const totalUnitsEl = document.getElementById("total-units");
const totalNetEl = document.getElementById("total-net");
const totalVolumeEl = document.getElementById("total-volume");
const totalGrossEl = document.getElementById("total-gross");
const containerAdviceEl = document.getElementById("container-advice");

const formatNumber = (value, decimals = 2) =>
  Number(value).toLocaleString("zh-CN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

function renderRows() {
  productsBody.innerHTML = "";

  products.forEach((item, idx) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.cn}</td>
      <td>${item.en}</td>
      <td>${item.pack}</td>
      <td>${formatNumber(item.netPerUnit, 0)}</td>
      <td>${formatNumber(item.volumePerUnit, 3)}</td>
      <td>${formatNumber(item.grossPerUnit, 1)}</td>
      <td><input type="number" min="0" step="1" value="0" data-index="${idx}" /></td>
      <td class="row-volume">0.000</td>
      <td class="row-gross">0.0</td>
    `;

    productsBody.appendChild(row);
  });
}

function getContainerSuggestion(totalVolume, totalGross) {
  const fitProfile = containerProfiles.find(
    (profile) => totalVolume <= profile.maxVolume && totalGross <= profile.maxGross
  );

  if (!fitProfile) {
    return "当前货量超过单个 40HQ 建议上限，请考虑拆分为多个集装箱。";
  }

  const volumeUsage = (totalVolume / fitProfile.maxVolume) * 100;
  const weightUsage = (totalGross / fitProfile.maxGross) * 100;

  return `建议柜型：${fitProfile.name}。体积利用率 ${formatNumber(
    volumeUsage,
    1
  )}% ，载重利用率 ${formatNumber(weightUsage, 1)}%。`;
}

function recalc() {
  const inputs = productsBody.querySelectorAll('input[type="number"]');

  let totalUnits = 0;
  let totalNet = 0;
  let totalVolume = 0;
  let totalGross = 0;

  inputs.forEach((input) => {
    const idx = Number(input.dataset.index);
    const item = products[idx];
    const units = Math.max(0, Number(input.value) || 0);
    const row = input.closest("tr");

    const rowVolume = units * item.volumePerUnit;
    const rowGross = units * item.grossPerUnit;

    row.querySelector(".row-volume").textContent = formatNumber(rowVolume, 3);
    row.querySelector(".row-gross").textContent = formatNumber(rowGross, 1);

    totalUnits += units;
    totalNet += units * item.netPerUnit;
    totalVolume += rowVolume;
    totalGross += rowGross;
  });

  totalUnitsEl.textContent = formatNumber(totalUnits, 0);
  totalNetEl.textContent = formatNumber(totalNet, 1);
  totalVolumeEl.textContent = formatNumber(totalVolume, 3);
  totalGrossEl.textContent = formatNumber(totalGross, 1);
  containerAdviceEl.textContent = getContainerSuggestion(totalVolume, totalGross);
}

renderRows();
productsBody.addEventListener("input", recalc);
recalc();
