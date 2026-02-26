// Carbon intensity data for energy sources in Japan
// Percentages represent the composition of the 'current' and 'simple' tariffs
// Carbon intensities are in gCO2/kWh

export enum EnergySourceType {
    LNG = 'LNG',
    Coal = 'Coal',
    Oil = 'Oil',
    HydroLarge = 'HydroLarge',
    HydroSmall = 'HydroSmall',
    Solar = 'Solar',
    Wind = 'Wind',
    Geothermal = 'Geothermal',
    Biomass = 'Biomass',
    FIT = 'FIT',
    JEPX = 'JEPX',
    WastePower = 'WastePower',
    Other = 'Other',
}

export type EnergySourceDefinition = {
    japaneseLabel: string;
    carbonIntensity: number; // gCO2/kWh
};

export type EnergySource = {
    type: EnergySourceType;
    name: string;
    japaneseLabel: string;
    percentage: number;
    carbonIntensity: number; // gCO2/kWh
};

// Central registry of energy sources and their carbon intensities
// Based on https://criepi.denken.or.jp/jp/kenkikaku/report/detail/Y06.html

const ENERGY_SOURCES: Record<EnergySourceType, EnergySourceDefinition> = {
    [EnergySourceType.LNG]: {
        japaneseLabel: 'LNG火力',
        carbonIntensity: 474,
    },
    [EnergySourceType.Coal]: {
        japaneseLabel: '石炭火力',
        carbonIntensity: 943,
    },
    [EnergySourceType.Oil]: {
        japaneseLabel: '石油火力',
        carbonIntensity: 738,
    },
    [EnergySourceType.HydroLarge]: {
        japaneseLabel: '水力（3万kW以上）',
        carbonIntensity: 11,
    },
    [EnergySourceType.HydroSmall]: {
        japaneseLabel: '水力（3万kW未満）',
        carbonIntensity: 11,  // TODO - check if small hydro has different intensity than large hydro
    },
    [EnergySourceType.Solar]: {
        japaneseLabel: '太陽光',
        carbonIntensity: 59,
    },
    [EnergySourceType.Wind]: {
        japaneseLabel: '風力',
        carbonIntensity: 26,
    },
    [EnergySourceType.Geothermal]: {
        japaneseLabel: '地熱',
        carbonIntensity: 13,
    },
    [EnergySourceType.Biomass]: {
        japaneseLabel: 'バイオマス',
        carbonIntensity: 120,
    },
    [EnergySourceType.FIT]: {
        japaneseLabel: 'FIT電気',
        carbonIntensity: 59, // TODO - same as solar for now, but could be different for rooftop vs large scale solar, or other FIT sources
    },
    [EnergySourceType.JEPX]: {
        japaneseLabel: 'JEPX',
        carbonIntensity: 500, // Average grid intensity
    },
    [EnergySourceType.WastePower]: {
        japaneseLabel: '廃棄物発電',
        carbonIntensity: 200, // TODO - Check
    },
    [EnergySourceType.Other]: {
        japaneseLabel: 'その他',
        carbonIntensity: 500, // Same as average grid intensity
    },
};

// Helper function to create an energy source entry
const createSource = (type: EnergySourceType, percentage: number): EnergySource => ({
    type,
    name: type,
    japaneseLabel: ENERGY_SOURCES[type].japaneseLabel,
    percentage,
    carbonIntensity: ENERGY_SOURCES[type].carbonIntensity,
});

// Current tariff composition
// https://octopusenergy.co.jp/fuel-mix-green
const CURRENT_TARIFF_SOURCES: EnergySource[] = [
    createSource(EnergySourceType.LNG, 76.61),
    createSource(EnergySourceType.Coal, 2.7),
    createSource(EnergySourceType.Oil, 0.03),
    createSource(EnergySourceType.HydroLarge, 0.2),
    createSource(EnergySourceType.Solar, 0.72),
    createSource(EnergySourceType.Wind, 0.06),
    createSource(EnergySourceType.HydroSmall, 0.17),
    createSource(EnergySourceType.Geothermal, 0.02),
    createSource(EnergySourceType.Biomass, 0.31),
    createSource(EnergySourceType.FIT, 0.46),
    createSource(EnergySourceType.JEPX, 17.16),
    createSource(EnergySourceType.Other, 1.56),
];

// Simple tariff composition
// https://octopusenergy.co.jp/fuel-mix-simple
const SIMPLE_TARIFF_SOURCES: EnergySource[] = [
    createSource(EnergySourceType.Solar, 33.38),
    createSource(EnergySourceType.LNG, 29.48),
    createSource(EnergySourceType.HydroSmall, 23.77),
    createSource(EnergySourceType.JEPX, 6.61),
    createSource(EnergySourceType.WastePower, 4.7),
    createSource(EnergySourceType.Coal, 1.04),
    createSource(EnergySourceType.FIT, 0.18),
    createSource(EnergySourceType.Biomass, 0.12),
    createSource(EnergySourceType.HydroLarge, 0.08),
    createSource(EnergySourceType.Wind, 0.02),
    createSource(EnergySourceType.Geothermal, 0.01),
    createSource(EnergySourceType.Oil, 0.01),
    createSource(EnergySourceType.Other, 0.6),
];

export const calculateCurrentTariffCarbonIntensity = (): number => {
    const totalIntensity = CURRENT_TARIFF_SOURCES.reduce((sum, source) => {
        return sum + (source.percentage / 100) * source.carbonIntensity;
    }, 0);

    return Math.round(totalIntensity);
};

export const calculateSimpleTariffCarbonIntensity = (): number => {
    const totalIntensity = SIMPLE_TARIFF_SOURCES.reduce((sum, source) => {
        return sum + (source.percentage / 100) * source.carbonIntensity;
    }, 0);

    return Math.round(totalIntensity);
};
