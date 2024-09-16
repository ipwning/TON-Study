import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';
import internal from 'stream';

export type DivisionByZeroConfig = {};

export function divisionByZeroConfigToCell(config: DivisionByZeroConfig): Cell {
    return beginCell().endCell();
}

export class DivisionByZero implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new DivisionByZero(address);
    }

    static createFromConfig(config: DivisionByZeroConfig, code: Cell, workchain = 0) {
        const data = divisionByZeroConfigToCell(config);
        const init = { code, data };
        return new DivisionByZero(contractAddress(workchain, init), init);
    }

    async getDivsionByZeroTest(provider: ContractProvider, val1:number, val2: number) {
        const { stack } = await provider.get("division_by_zero", [
            { type: 'int', value: BigInt(val1) },
            { type: 'int', value: BigInt(val2) },
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
