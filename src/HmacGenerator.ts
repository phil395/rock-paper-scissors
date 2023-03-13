import { randomBytes, createHmac } from "node:crypto";
import { promisify } from "node:util";

import type { IHmacGenerator } from "./interfaces";

export class HmacGenerator implements IHmacGenerator {
  private key: string;
  private hmac: string;

  constructor(private algorithm: string, private keySize: number) {}

  private async makeRandomKey() {
    const randomBuf = await promisify(randomBytes)(this.keySize);
    return randomBuf.toString("hex");
  }

  public async generateHmac(data: string) {
    this.key = await this.makeRandomKey();
    const hmac = createHmac(this.algorithm, this.key);
    hmac.update(data);
    this.hmac = hmac.digest("hex");
  }

  public getResult(): [hmac: string, key: string, algorithm: string] {
    if (!this.hmac) {
      throw new Error("hmac not generated yet");
    }
    return [this.hmac, this.key, this.algorithm];
  }
}
