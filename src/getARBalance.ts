import axios from "axios";

export async function getARBalance(arweaveAddress: string) {
  const url = `https://arweave.net/wallet/${arweaveAddress}/balance`;
  try {
    const response = await axios.get(url);
    const WINSTON_DENOMINATION = 1000_000_000_000;
    return response.data / WINSTON_DENOMINATION;
  } catch (error) {
    console.log(arweaveAddress, error);
    return 0;
  }
}
