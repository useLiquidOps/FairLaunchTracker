import { getARBalance } from "./src/getARBalance";
import { getAOProjection } from "./src/getAOprojection";
import { readFile } from "fs/promises";
import { join } from "path";
import { AOToUSD } from "./src/AOToUSD";

type TokenAllocation = {
  value: number;
  label: string;
  id: string;
};

type AddressData = {
  [key: string]: TokenAllocation[];
};

type Message = {
  Data: AddressData;
  Anchor: string;
  Target: string;
  Tags: Array<{
    value: string;
    name: string;
  }>;
};

type TransactionData = {
  Messages: Message[];
  Assignments: any[];
  Spawns: any[];
  Output: {
    data: string;
    prompt: string;
    print: boolean;
  };
  GasUsed: number;
};

const processTransactions = async () => {
  try {
    const fileContent = await readFile(
      join(process.cwd(), "./src/transactions.json"),
      "utf8",
    );
    const data: TransactionData = JSON.parse(fileContent);
    const addressData: AddressData = data.Messages[0].Data;

    // Object to store total allocated AO for each label
    const totalAllocatedAO: { [key: string]: number } = {};
    let totalAOPerThirtyDays = 0;

    for (const arweaveAddress in addressData) {
      const allocations: TokenAllocation[] = addressData[arweaveAddress];
      console.log("Address:", arweaveAddress);

      const arweaveBalance = await getARBalance(arweaveAddress);
      console.log("arweaveBalance", arweaveBalance);

      const AOPerThirtyDays = getAOProjection(arweaveBalance);
      totalAOPerThirtyDays += AOPerThirtyDays;
      console.log("AOPerThirtyDays", AOPerThirtyDays);
      console.log("Allocations:", allocations);
      console.log("-------------------");

      // Calculate actual AO allocated based on user's balance
      allocations.forEach((allocation) => {
        if (!totalAllocatedAO[allocation.label]) {
          totalAllocatedAO[allocation.label] = 0;
        }
        totalAllocatedAO[allocation.label] +=
          AOPerThirtyDays * allocation.value;
      });
    }

    // Log total allocated AO
    console.log("\nTotal AO allocated to each project:");
    for (const [label, total] of Object.entries(totalAllocatedAO)) {
      const AOUSDValue = AOToUSD(total);
      console.log("---------");
      console.log(
        `${label}: ${total}. USD value: $${AOUSDValue.toLocaleString()}`,
      );
    }

    console.log("---------");
    console.log(
      `Total AO per 30 days for all addresses: ${totalAOPerThirtyDays}`,
    );
    console.log(
      `USD Value: $${AOToUSD(totalAOPerThirtyDays).toLocaleString()}`,
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

processTransactions();
