import { create } from "ipfs-http-client";
import { typeFile } from "../types/types";
import { Keyring } from "@polkadot/keyring";
import { testPin } from "./pinningService";

const seeds = process.env.NEXT_PUBLIC_SEEDS as string;

const keyring = new Keyring();
const pair = keyring.addFromUri(seeds);
const sig = pair.sign(pair.address);
const sigHex = "0x" + Buffer.from(sig).toString("hex");

const authHeader = Buffer.from(`sub-${pair.address}:${sigHex}`).toString(
  "base64"
);

const ipfsGateway = "https://crustgateway.com";
const ipfs = create({
  url: ipfsGateway + "/api/v0/add",
  headers: {
    authorization: "Basic " + authHeader,
  },
});

export const handleAdd = async (file: File, imgFile: File) => {
  console.log(seeds);
  try {
    const vcRes = await addFileToIpfs(file);
    const imgRes = await addFileToIpfs(imgFile);
    console.log(
      "CIDs of image and VC",
      vcRes.cid.toV0().toString(),
      imgRes.cid.toV0().toString()
    );
    const res = await addDataToIpfs({
      name: file.name,
      description: "This is a test",
      vc: "ipfs://" + vcRes.cid.toV0().toString(),
      image: "ipfs://" + imgRes.cid.toV0().toString(),
    });
    console.log("CID of data", res.cid.toV0().toString());
    console.log("CID of name", res.size);
    console.log("CID of data", res);
  } catch (error) {
    console.log(error);
  }
};

export const addFileToIpfs = async (data: File) => {
  console.log(data);
  const metadata = await ipfs.add(data);

  if (metadata) {
    return metadata;
  } else {
    throw new Error("IPFS add failed, please try again.");
  }
};

export const addDataToIpfs = async (data: typeFile) => {
  const jsonData = JSON.stringify(data);
  const metadata = await ipfs.add(jsonData);

  if (metadata) {
    return metadata;
  } else {
    throw new Error("IPFS add failed, please try again.");
  }
};
