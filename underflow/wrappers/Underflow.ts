import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';
import internal from 'stream';

export type UnderflowConfig = {};

export function underflowConfigToCell(config: UnderflowConfig): Cell {
    return beginCell().endCell();
}

export class Underflow implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Underflow(address);
    }

    static createFromConfig(config: UnderflowConfig, code: Cell, workchain = 0) {
        const data = underflowConfigToCell(config);
        const init = { code, data };
        return new Underflow(contractAddress(workchain, init), init);
    }

    async getUnderflowTest(provider: ContractProvider, val:number) {
        const { stack } = await provider.get("underflow", [
            { type: 'int', value: BigInt(val) },
        ]);

        return stack.readBigNumber();
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
