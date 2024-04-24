import CrustPinner from "@crustio/crust-pin";

export const crustPin = async (cidString: string) => {
  const seeds = process.env.NEXT_PUBLIC_SEEDS as string;

  const crust = new CrustPinner(seeds);
  const res = await crust.pin(cidString);
  return res;
};
