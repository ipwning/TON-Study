import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Underflow } from '../wrappers/Underflow';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Underflow', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Underflow');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let underflow: SandboxContract<Underflow>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        underflow = blockchain.openContract(Underflow.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await underflow.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: underflow.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        const t1 = await underflow.getUnderflowTest(-1);
        console.log("The t1 value is: %d", t1);
        const t2 = await underflow.getUnderflowTest(1);
        console.log("The t2 value is: %d", t2);
    });
});
