# Ark Faucet Plugin

> Faucet plugin for [Ark Core](https://github.com/ArkEcosystem/core). This plugin enables api endpoints for a faucet only and does not include a template.

## Demo

https://devnet.money

## 1. Installation

`yarn global add @deadlock-delegate/faucet`

### 2. Registration

Open `~/.config/ark-core/<network>/plugins.js` and add the following at the very end:

```js
'@deadlock-delegate/faucet': {}
```

like so:

```js
module.exports = {
  '@arkecosystem/core-event-emitter': {},
  '@arkecosystem/core-config': {},
  ...
  '@deadlock-delegate/faucet': {}  // this is the newly added line, put it at the very end
}
```

### 3. Configuration

You set configuration in the `plugins.js` where you added the `'@deadlock-delegate/faucet': {}` line:

```js
module.exports = {
  '@arkecosystem/core-event-emitter': {},
  '@arkecosystem/core-config': {},
  ...
  '@deadlock-delegate/faucet': {
    server: {
      host: '0.0.0.0',
      port: 5000,
      routes: {
        cors: true
      }
    },
    relays: [`http://127.0.0.1:${process.env.ARK_API_PORT || 4003}`],
    walletAddress: '<insert faucet wallet address here>',
    walletPassphrase: '<insert faucet passphrase here>',
    walletSecondPassphrase: '<insert faucet 2nd passphrase here>',
    payoutAmount: 5 * Math.pow(10, 8), // 5 (eg. ARK)
    payoutCooldown: 259200, // 3 days
    dailyPayoutLimit: 200 * Math.pow(10, 8) // 200 (eg. ARK)
  }
}
```

#### What each setting means?

```
enabled - if you wish to disable the plugin set this to `false`
relays - list of relays through which you wish to broadcast transactions
walletAddress - address of your faucet
walletPassphrase - passphrase of your faucet's wallet
walletSecondPassphrase - second passphrase of your faucet's wallet (leave empty if you don't have it)
vendorField - what message you wish to add to each payout
payoutAmount - what amount you wish to payout per request
payoutCooldown - for how long will user not be able to request a payment for
dailyPayoutLimit - what's the faucet's max (overall) daily payout
```

Above settings are the main ones. If you wish to customize the database or server settings on which
the API is running, you should have a look at `lib/default.js`.

### 4. Run Core with plugins

After you've completed all of the above steps you have to restart your relay process to pick up the plugin from the plugin.js. You can do so by running `ark relay:restart`.

### Upgrades

In case of any updates you can upgrade the plugin using the command bellow.

`yarn global upgrade @deadlock-delegate/faucet`

## Credits

- [roks0n](https://github.com/roks0n)
- [All Contributors](../../../../contributors)

## License

[MIT](LICENSE) © roks0n
