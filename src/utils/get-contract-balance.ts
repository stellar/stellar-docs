import {
  Contract,
  scValToBigInt,
  TransactionBuilder,
  TimeoutInfinite,
  Address,
  SorobanRpc
} from "@stellar/stellar-sdk";
import { FUTURENET_DETAILS } from "../contants";

const XLM_DECIMALS = 7;

const BASE_FEE = "100";
const RPC_URLS: { [key: string]: string } = {
  FUTURENET: "https://rpc-futurenet.stellar.org/",
};
const server = new SorobanRpc.Server(RPC_URLS[FUTURENET_DETAILS.network]);

function formatAmount(
  undivided: bigint,
  decimals?: number = XLM_DECIMALS,
): string {
  const n =
    undivided.valueOf() < BigInt(Number.MAX_SAFE_INTEGER)
      ? Number(undivided) / 10 ** decimals
      : undivided.valueOf() / 10n ** BigInt(decimals);
  return String(n);
}

export const getContractBalance = async (
  contractId: string,
  address: string,
): Promise<number> => {
  const account = await server.getAccount(address);
  const contract = new Contract(contractId);
  const params = [new Address(address).toScVal()];

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: FUTURENET_DETAILS.networkPassphrase,
  })
    .addOperation(contract.call("balance", ...params))
    .setTimeout(TimeoutInfinite)
    .build();

  const response = await server.simulateTransaction(transaction);
  if (!SorobanRpc.Api.isSimulationSuccess(response)) {
    throw response;
  }

  const balanceStr = formatAmount(scValToBigInt(response.result!.retval));
  return +balanceStr;
};
