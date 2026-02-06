import { gql } from "graphql-request";

export const queryPools = () => {
  return gql`
    query {
      lendingPoolCreateds(where: {contractChainId: 1001}) {
        items {
          lendingPool
          collateralToken
          borrowToken
          ltv
          baseRate
          liquidationBonus
          liquidationThreshold
          maxRate
          maxUtilization
          optimalUtilization
          rateAtOptimal
          sharesToken
          router
        }
      }
    }
  `;
};
