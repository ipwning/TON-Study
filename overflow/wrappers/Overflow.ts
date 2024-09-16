import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';
import internal from 'stream';

export type OverflowConfig = {};

export function overflowConfigToCell(config: OverflowConfig): Cell {
    return beginCell().endCell();
}

export class Overflow implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Overflow(address);
    }

    static createFromConfig(config: OverflowConfig, code: Cell, workchain = 0) {
        const data = overflowConfigToCell(config);
        const init = { code, data };
        return new Overflow(contractAddress(workchain, init), init);
    }

    async getOverflowTest(provider: ContractProvider, val:number) {
        const { stack } = await provider.get("overflow", [
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
