import { gql } from "graphql-request";

export const querySupply = () => {
  return gql`
    query supply {
      supplyCollaterals(where: { contractChainId: 5042002 }) {
        items {
          amount
          lendingPoolAddress
        }
      }
      supplyLiquiditys(where: { contractChainId: 5042002 }) {
        items {
          amount
          lendingPoolAddress
        }
      }
    }
  `;
};
