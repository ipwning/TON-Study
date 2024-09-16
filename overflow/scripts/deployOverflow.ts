import { toNano } from '@ton/core';
import { Overflow } from '../wrappers/Overflow';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const overflow = provider.open(Overflow.createFromConfig({}, await compile('Overflow')));

    await overflow.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(overflow.address);

    // run methods on `overflow`
}
