import BigNumber from 'bignumber.js';

export interface User {
  id: string;
  name: string;
  email?: string;

  rawAmount: BigNumber;
  depositAddress?: string;

  createdAt: string;
}
