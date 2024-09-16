import { toNano } from '@ton/core';
import { Underflow } from '../wrappers/Underflow';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const underflow = provider.open(Underflow.createFromConfig({}, await compile('Underflow')));

    await underflow.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(underflow.address);

    // run methods on `underflow`
}
