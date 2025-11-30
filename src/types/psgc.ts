// Types for Philippine Standard Geographic Code API

export interface Region {
  code: string;
  name: string;
  regionName: string;
  islandGroupCode: string;
  psgc10DigitCode: string;
}

export interface Province {
  code: string;
  name: string;
  regionCode: string;
  islandGroupCode: string;
  psgc10DigitCode: string;
}

export interface City {
  code: string;
  name: string;
  oldName: string;
  isCapital: boolean;
  districtCode: string | null;
  provinceCode: string;
  regionCode: string;
  islandGroupCode: string;
  psgc10DigitCode: string;
}

export interface Municipality {
  code: string;
  name: string;
  oldName: string;
  isCapital: boolean;
  districtCode: string | null;
  provinceCode: string;
  regionCode: string;
  islandGroupCode: string;
  psgc10DigitCode: string;
}

export interface Barangay {
  code: string;
  name: string;
  oldName: string;
  subMunicipalityCode: string | null;
  cityCode: string;
  municipalityCode: string | null;
  districtCode: string | null;
  provinceCode: string;
  regionCode: string;
  islandGroupCode: string;
  psgc10DigitCode: string;
}
