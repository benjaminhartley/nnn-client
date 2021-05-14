import BigNumber from 'bignumber.js';

const NANO_CONSTANT = new BigNumber('10e29');

function convertRawToNano(raw: BigNumber): BigNumber {
  return raw.dividedBy(NANO_CONSTANT);
}

function convertNanoToRaw(nano: BigNumber): BigNumber {
  return nano.times(NANO_CONSTANT);
}

export default {
  convertNanoToRaw,
  convertRawToNano,
};
