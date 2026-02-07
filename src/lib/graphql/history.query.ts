import { gql } from "graphql-request";

export const DEFAULT_HISTORY_LIMIT = 100;

export interface HistoryQueryParams {
  limit?: number;
  offset?: number;
  poolAddress?: string;
  userAddress?: string;
}

const buildWhereClause = (
  poolAddress?: string,
  userAddress?: string,
  userField: string = "user",
) => {
  const parts = [`contractChainId: 5042002`];
  if (poolAddress) {
    parts.push(`lendingPoolAddress: "${poolAddress.toLowerCase()}"`);
  }
  if (userAddress) {
    parts.push(`${userField}: "${userAddress.toLowerCase()}"`);
  }
  return `{${parts.join(", ")}}`;
};

export const queryAllHistory = (params: HistoryQueryParams = {}) => {
  const {
    limit = DEFAULT_HISTORY_LIMIT,
    offset = 0,
    poolAddress,
    userAddress,
  } = params;

  const whereCommon = buildWhereClause(poolAddress, userAddress, "user");
  const whereLiquidation = buildWhereClause(
    poolAddress,
    userAddress,
    "borrower",
  );

  return gql`
    query {
      supplyCollaterals(
        orderBy: "timestamp"
        orderDirection: "desc"
        limit: ${limit}
        offset: ${offset}
        where: ${whereCommon}
      ) {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
        }
      }
      supplyLiquiditys(
        orderBy: "timestamp"
        orderDirection: "desc"
        limit: ${limit}
        offset: ${offset}
        where: ${whereCommon}
      ) {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
        }
      }
      withdrawCollaterals(
        orderBy: "timestamp"
        orderDirection: "desc"
        limit: ${limit}
        offset: ${offset}
        where: ${whereCommon}
      ) {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
        }
      }
      withdrawLiquiditys(
        orderBy: "timestamp"
        orderDirection: "desc"
        limit: ${limit}
        offset: ${offset}
        where: ${whereCommon}
      ) {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
        }
      }
      borrowDebts(
        orderBy: "timestamp"
        orderDirection: "desc"
        limit: ${limit}
        offset: ${offset}
        where: ${whereCommon}
      ) {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
        }
      }
      repayByPositions(
        orderBy: "timestamp"
        orderDirection: "desc"
        limit: ${limit}
        offset: ${offset}
        where: ${whereCommon}
      ) {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
        }
      }
      borrowDebtCrossChains(
        orderBy: "timestamp"
        orderDirection: "desc"
        limit: ${limit}
        offset: ${offset}
        where: ${whereCommon}
      ) {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
          chainId
        }
      }
      liquidations(
        orderBy: "timestamp"
        orderDirection: "desc"
        limit: ${limit}
        offset: ${offset}
        where: ${whereLiquidation}
      ) {
        items {
          id
          userBorrowAssets
          liquidationBonus
          lendingPoolAddress
          borrower
          txHash
          timestamp
          contractChainId
        }
      }
    }
  `;
};
