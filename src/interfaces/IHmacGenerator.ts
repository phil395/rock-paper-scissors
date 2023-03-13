export interface IHmacGenerator {
  generateHmac(data: string): Promise<void>;
  getResult(): [hmac: string, key: string, algorithm: string];
}
