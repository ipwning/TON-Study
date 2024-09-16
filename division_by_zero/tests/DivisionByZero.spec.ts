import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { DivisionByZero } from '../wrappers/DivisionByZero';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('DivisionByZero', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('DivisionByZero');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let divisionByZero: SandboxContract<DivisionByZero>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        divisionByZero = blockchain.openContract(DivisionByZero.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await divisionByZero.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: divisionByZero.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        const t1 = await divisionByZero.getDivsionByZeroTest(5, 2);
        console.log('The t1 value is: %d', t1);
        const t2 = await divisionByZero.getDivsionByZeroTest(5, 0);
        console.log('The t2 value is: %d', t2);
    });
});
