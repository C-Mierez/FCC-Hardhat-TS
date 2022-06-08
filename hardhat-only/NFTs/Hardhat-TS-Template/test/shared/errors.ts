// This is what will hopefully be automated by Typechain if https://github.com/dethcrypto/TypeChain/issues/667 is resolved

export enum BaseErrors {
  ZeroAddress = "ZeroAddress",
  ZeroValue = "ZeroValue",
  ZeroOrNegativeValue = "ZeroOrNegativeValue",
  UnexpectedCaller = "UnexpectedCaller",
  UnauthorizedCaller = "UnauthorizedCaller",
}

export enum TokenErrors {
  NotEnoughBalance = "NotEnoughBalance",
  ERC20TransferFailed = "ERC20TransferFailed",
  MaxSupplyExceeded = "MaxSupplyExceeded",
}

export enum InitializableErrors {
  AlreadyInitialized = "Initializable: contract is already initialized",
}

export enum ERC20Errors {
  InsufficientAllowance = "ERC20: insufficient allowance",
  InsufficientBalance = "ERC20: transfer amount exceeds balance",
}

export enum OwnableErrors {
  NotOwner = "Ownable: caller is not the owner",
}
