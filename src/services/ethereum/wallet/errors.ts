import { Errors } from 'shared/constants';

export class WalletConnectionError extends Error {
  constructor() {
    super('Connection error');
    this.name = Errors.WALLET_CONNECTION_ERROR;
  }
}

export class WalletNoActiveConnectionError extends Error {
  constructor() {
    super('No active connection');
    this.name = Errors.WALLET_NO_ACTIVE_CONNECTION_ERROR;
  }
}

export class WalletQrDoesNotExistError extends Error {
  constructor() {
    super('Qr code does not exist');
    this.name = Errors.WALLET_QR_CODE_DOES_NOT_EXIST_ERROR;
  }
}

export class WalletAlreadyConnectedError extends Error {
  constructor() {
    super('Qr code does not exist');
    this.name = Errors.WALLET_ALREADY_CONNECTED_ERROR;
  }
}
