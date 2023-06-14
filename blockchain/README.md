# Device Binding

## HIW

### 1. Set up environment

```bash
echo PRIVATE_KEY=<PRIVATE_KEY> > .env
// e.g. echo PRIVATE_KEY=111111111111111111111111111111111111 > .env
```

### 2. Run tests

```bash
npm run test
```

### 3. Try deploy in hardhat environment

```bash
npm run deploy
```

### 4. Deploy to testnet

```bash
npm run deploy:testnet
```

### 5. Run tasks

```bash
npx hardhat grant-ring-minter --network testnet
```

```bash
npx hardhat grant-sleepr-minter --network testnet
```
