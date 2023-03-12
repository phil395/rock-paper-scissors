import { randomBytes, createHmac } from "node:crypto";
import { promisify } from "node:util";

export class Authn {
  public key: string;
  public hmac: string;

  constructor(public algorithm: string) {}

  private async makeRandomKey() {
    const randomBuf = await promisify(randomBytes)(32);
    return randomBuf.toString("hex");
  }

  public async generateHmac(data: string) {
    this.key = await this.makeRandomKey();
    const hmac = createHmac(this.algorithm, this.key);
    hmac.update(data);
    this.hmac = hmac.digest("hex");
  }
}
