import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Overflow } from '../wrappers/Overflow';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Overflow', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Overflow');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let overflow: SandboxContract<Overflow>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        overflow = blockchain.openContract(Overflow.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await overflow.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: overflow.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        const t1 = await overflow.getOverflowTest(-1);
        console.log("The t1 value is: %d", t1);
        const t2 = await overflow.getOverflowTest(1);
        console.log("The t2 value is: %d", t2);

        // const t3 = await overflow.getSubTest(-1);
        // console.log("Sub test: %d", t3);
        // const t4 = await overflow.getSubTest(1);
        // console.log("Underflow test: %d", t4);
    });
});
