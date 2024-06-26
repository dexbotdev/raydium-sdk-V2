import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import OutlinedInput from '@mui/material/OutlinedInput'
import {
  Percent,
  // RouteInfo,
  // RouteType,
  TokenAmount,
  WSOLMint,
  USDCMint,
  USDTMint,
  TickUtils,
  solToWSol,
  JupTokenType,
  getATAAddress,
  farmRewardLayout,
  struct,
  u64,
  u128,
} from '@raydium-io/raydium-sdk'
import debounce from 'lodash/debounce'
import { useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, initializeAccountInstructionData } from '@solana/spl-token'

import { useAppStore } from '../store/appStore'
import Decimal from 'decimal.js'
import BN from 'bn.js'

import { pool, rewards, printSimulate } from './data'

export default function Swap() {
  const raydium = useAppStore((state) => state.raydium)
  const connected = useAppStore((state) => state.connected)
  const tokenAccounts = useAppStore((state) => state.tokenAccounts)
  const [inAmount, setInAmount] = useState<string>('')
  const [outAmount, setOutAmount] = useState<TokenAmount>()
  const [minOutAmount, setMinOutAmount] = useState<TokenAmount>()
  // const [routes, setRoutes] = useState<RouteInfo[]>([])
  // const [routeType, setRouteType] = useState<RouteType>('amm')
  const [loading, setLoading] = useState<boolean>(false)

  //   {
  //     "liquidity": "924328012",
  //     "amountMaxA": "0.13598858172588832487",
  //     "amountMaxB": "15.939417258883248731"
  // }

  // ray mint: 4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R
  // PublicKey.default => sdk will auto recognize it as sol token
  // const [inToken, outToken] = [
  //   '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
  //   '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
  // ]
  // const [inToken, outToken] = ['4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', PublicKey.default.toBase58()]
  // const [inToken, outToken] = [PublicKey.default.toBase58(), '9gP2kCy3wA1ctvYWQk75guqXuHfrEomqydHLtcTCqiLa']
  // const [inToken, outToken] = ['4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', PublicKey.default.toBase58()]

  const [inToken, outToken] = [PublicKey.default.toBase58(), '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R']

  useEffect(() => {
    async function calculateAmount() {
      if (!raydium || !tokenAccounts.length) return

      // const ownerMintToAccount: { [mint: string]: PublicKey } = {}
      // for (const item of tokenAccounts) {
      //   const ata = getATAAddress(raydium.ownerPubKey!, item.mint!, item.programId ?? TOKEN_PROGRAM_ID).publicKey
      //   if (item.publicKey && ata.equals(item.publicKey)) ownerMintToAccount[item.mint!.toString()] = item.publicKey!
      // }
      const { transaction, instructionTypes, execute } = await raydium.clmm.initRewards({
        poolInfo: pool as any,
        checkCreateATAOwner: true,
        ownerInfo: { useSOLBalance: true },
        rewardInfos: rewards.map((r) => ({ ...r, perSecond: new Decimal(r.perSecond) })),
      })

      // transaction.instructions.forEach((i) => {
      //   // console.log(123123111, i.data, i.programId.toString())
      //   const dataLayout = struct([u64('openTime'), u64('endTime'), u128('emissionsPerSecondX64')])
      //   const d = dataLayout.decode(i.data)
      //   if (i.programId.equals(TOKEN_PROGRAM_ID)) {
      //     console.log(1231236666, i, initializeAccountInstructionData.decode(i.data))
      //   } else {
      //     console.log(123123111, i.programId.toString(), i.data.length, dataLayout.span, {
      //       emission: d.emissionsPerSecondX64.toString(),
      //       openTime: d.openTime.toString(),
      //       endtime: d.endTime.toString(),
      //     })
      //   }
      //   // i.keys.forEach((k) => {
      //   //   console.log(123123222222, k.pubkey.toString(), k)
      //   // })
      // })

      // execute()
      // r.execute()
      // await raydium.token.load({ type: JupTokenType.ALL })
      // await raydium.ammV3.load()
      // await raydium.ammV3.fetchPoolAccountPosition()
      //3tD34VtprDSkYCnATtQLCiVgTkECU3d12KtjupeR6N2X

      // const { routes, poolsInfo, ticks } = await raydium.tradeV2.fetchPoolAndTickData({
      //   inputMint: WSOLMint,
      //   outputMint: USDTMint,
      // })

      // const poolData = await raydium.tradeV2.fetchPoolAndTickData({
      //   inputMint: inToken,
      //   outputMint: outToken,
      // })

      // const { routes, poolsInfo, ticks } = poolData
      // const { best } = await raydium.tradeV2.getAllRouteComputeAmountOut({
      //   directPath: routes.directPath,
      //   routePathDict: routes.routePathDict,
      //   simulateCache: poolsInfo,
      //   tickCache: ticks,
      //   inputTokenAmount: raydium.mintToTokenAmount({ mint: inToken, amount: '0.01' }),
      //   outputToken: raydium.mintToToken(outToken),
      //   slippage: new Percent(1, 100),
      //   chainTime: ((await raydium.chainTimeOffset()) + Date.now()) / 1000,
      // })

      // console.log(123123, best?.poolType, best?.routeType)
      // best?.poolKey.forEach((p) => console.log(12312311, 'poolKey', p.id.toString()))

      // const { execute, transactions } = await raydium.tradeV2.swap({
      //   swapInfo: best!,
      //   associatedOnly: true,
      //   checkTransaction: true,
      //   checkCreateATAOwner: false,
      // })

      // transactions.forEach((t) => {
      //   console.log(12312322, 'tx ins len:', t.instructions.length)
      //   t.instructions.forEach((i) => {
      //     console.log(123123333, i.programId.toBase58())
      //   })
      // })

      // execute()

      if (!inAmount) {
        setOutAmount(undefined)
        setMinOutAmount(undefined)
        return
      }
      setLoading(true)
      /**
       * call getAvailablePools is optional, if you want to choose swap route by self
       *
       * return pool options: { availablePools, best, routedPools }, default will choose routedPools
       */
      // const { routedPools } = await raydium!.trade.getAvailablePools({
      //   inputMint: inToken,
      //   outputMint: outToken,
      // })!

      // if (!inAmount) {
      //   setLoading(false)
      //   return
      // }

      // const {
      //   amountOut: _amountOut,
      //   minAmountOut,
      //   routes,
      //   routeType,
      // } = await raydium!.trade.getBestAmountOut({
      //   pools: routedPools, // optional, pass only if called getAvailablePools
      //   amountIn: raydium!.decimalAmount({ mint: inToken, amount: inAmount })!,
      //   inputToken: raydium!.mintToToken(inToken),
      //   outputToken: raydium!.mintToToken(outToken),
      //   slippage: new Percent(1, 100),
      // })!

      // setOutAmount(_amountOut)
      // setMinOutAmount(minAmountOut)
      // setRouteType(routeType)
      // setRoutes(routes)
      // setLoading(false)
    }

    const debounceCalculate = debounce(() => {
      calculateAmount()
    }, 500)

    if (connected) {
      debounceCalculate()
    }
    return () => debounceCalculate.cancel()
  }, [connected, inToken, outToken, inAmount, raydium, tokenAccounts])

  const handleClick = async () => {
    // const { signers, execute, extInfo } = await raydium!.trade.swap({
    //   routes,
    //   routeType,
    //   amountIn: raydium!.mintToTokenAmount({ mint: inToken, amount: inAmount })!,
    //   amountOut: minOutAmount!,
    //   fixedSide: 'in',
    // })
    // await execute()
    /**
     * if you don't care about route/out amount, you can just call directSwap to execute swap
     */
    // const { transaction, signers, execute, extInfo } = await raydium!.trade.directSwap({
    //   amountOut: raydium!.mintToTokenAmount({ mint: outToken, amount: '0' })!,
    //   amountIn: raydium!.mintToTokenAmount({ mint: inToken, amount: inAmount })!,
    //   fixedSide: 'in',
    //   slippage: new Percent(1, 100),
    // })
    // const txId = execute()
  }
  const [inTokenInfo, outTokenInfo] = [raydium?.token.tokenMap.get(inToken), raydium?.token.tokenMap.get(outToken)]

  return (
    <div>
      <Box sx={{ maxWidth: 300 }}>
        {inTokenInfo ? (
          <Grid container alignItems="center" my="20px">
            <Grid>
              <Avatar
                sx={{ mr: '10px' }}
                alt={inTokenInfo.symbol}
                src={inTokenInfo.logoURI}
                imgProps={{ loading: 'lazy' }}
              />
            </Grid>
            <Grid>{inTokenInfo.symbol}</Grid>
          </Grid>
        ) : null}
        <div>Amount In</div>
        <OutlinedInput
          type="number"
          value={inAmount}
          onChange={(e) => setInAmount(e.target.value)}
          // label="Amount In"
          // variant="outlined"
        />
        <Grid container alignItems="center" my="20px">
          {outTokenInfo ? (
            <>
              <Grid>
                <Avatar
                  sx={{ mr: '10px' }}
                  alt={outTokenInfo.symbol}
                  src={outTokenInfo.logoURI}
                  imgProps={{ loading: 'lazy' }}
                />
              </Grid>
              <Grid>{outTokenInfo.symbol}</Grid>
            </>
          ) : null}
        </Grid>
        <div>Amount Out</div>
        <OutlinedInput
          type="number"
          value={outAmount?.toSignificant() || ''}
          // label="Amount Out"
          // variant="outlined"
          startAdornment={loading ? <CircularProgress /> : undefined}
          disabled
        />
        <div>min amount out: {minOutAmount?.toSignificant()}</div>
      </Box>
      <Button variant="contained" sx={{ mt: '20px' }} onClick={handleClick}>
        Swap
      </Button>
    </div>
  )
}
