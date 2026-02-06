import { gql } from "graphql-request";

export const queryPoolRates = () => {
  return gql`
    query {
      lendingPoolRates(where: {contractChainId: 1001}) {
        items {
          lendingPool
          apy
          rate
          utilizationRate
          totalLiquidity
          totalBorrow
          totalCollateral
          collateralToken
          borrowToken
        }
      }
    }
  `;
};
