import { toNano } from '@ton/core';
import { DivisionByZero } from '../wrappers/DivisionByZero';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const divisionByZero = provider.open(DivisionByZero.createFromConfig({}, await compile('DivisionByZero')));

    await divisionByZero.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(divisionByZero.address);

    // run methods on `divisionByZero`
}
