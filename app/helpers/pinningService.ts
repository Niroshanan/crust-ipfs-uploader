import got from "got";

import { Keyring } from "@polkadot/keyring";

export const testPin = async (cidString: string) => {
  const seeds = process.env.NEXT_PUBLIC_SEEDS as string;

  const keyring = new Keyring();
  const pair = keyring.addFromUri(seeds);
  const sig = pair.sign(pair.address);
  const sigHex = "0x" + Buffer.from(sig).toString("hex");

  const authHeader = Buffer.from(`sub-${pair.address}:${sigHex}`).toString(
    "base64"
  );

  const ipfsPinningService = "https://pin.crustcode.com/psa";

  const data = await got.post(ipfsPinningService + "/pins", {
    headers: {
      authorization: "Bearer " + authHeader,
    },
    json: {
      cid: cidString,
      name: "crust-demo",
    },
  });
  return data;
};
