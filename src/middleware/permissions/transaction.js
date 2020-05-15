import * as rules from "./rules";

export const TransactionQuery = {
  allNegativeTransactions: rules.isAuthenticated,
  allPositiveTransactions: rules.isAuthenticated,
  allTransactions: rules.isAuthenticated,
};
