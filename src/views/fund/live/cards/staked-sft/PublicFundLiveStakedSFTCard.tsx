// ** Next Imports
import Image from 'next/image'

// ** MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Third-Party Imports
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Atropos } from 'atropos/react'
import format from 'date-fns/format'
import toast from 'react-hot-toast'

// ** Core Component Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Custom Component Imports
import PublicFundLiveStakedSFTSkeletonCard from 'src/views/fund/live/cards/staked-sft/PublicFundLiveStakedSFTSkeletonCard'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Util Imports
import { getFundCurrencyProperties, getFormattedPriceUnit, getChainId } from 'src/utils'

// ** Config Imports
import type { wagmiConfig } from 'src/configs/ethereum'

// ** Type Imports
import type { FundType } from 'src/types/fundTypes'

// ** Styled <sup> Component
const Sup = styled('sup')(({ theme }) => ({
  fontSize: '1.2rem',
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

type StakeRecordType = [string, bigint, bigint, number, number, bigint]
interface Props {
  initFundEntity: FundType
  sftIndex: number
}

const PublicFundLiveStakedSFTCard = (props: Props) => {
  // ** Props
  const { initFundEntity, sftIndex } = props

  // ** Hooks
  const theme = useTheme()
  const walletAccount = useAccount()

  const { data: sftId, isLoading: isSftIdLoading } = useReadContract({
    chainId: getChainId(initFundEntity.chain) as (typeof wagmiConfig)['chains'][number]['id'],
    abi: initFundEntity.sft.contractAbi,
    address: initFundEntity.sft.contractAddress as `0x${string}`,
    functionName: 'tokenOfOwnerByIndex',
    args: [initFundEntity.vault.contractAddress, sftIndex],
    account: walletAccount.address!
  })

  const { data: sftValue, isLoading: isSftValueLoading } = useReadContract({
    chainId: getChainId(initFundEntity.chain) as (typeof wagmiConfig)['chains'][number]['id'],
    abi: initFundEntity.sft.contractAbi,
    address: initFundEntity.sft.contractAddress as `0x${string}`,
    functionName: 'balanceOf',
    args: [sftId],
    account: walletAccount.address!,
    query: {
      enabled: !isSftIdLoading && sftId !== undefined
    }
  })

  const { data: sftSlotId, isLoading: isSftSlotIdLoading } = useReadContract({
    chainId: getChainId(initFundEntity.chain) as (typeof wagmiConfig)['chains'][number]['id'],
    abi: initFundEntity.sft.contractAbi,
    address: initFundEntity.sft.contractAddress as `0x${string}`,
    functionName: 'slotOf',
    args: [sftId],
    account: walletAccount.address!,
    query: {
      enabled: !isSftIdLoading && sftId !== undefined
    }
  })

  const { data: vaultStakeRecord, isLoading: isVaultStakeRecordLoading } = useReadContract({
    chainId: getChainId(initFundEntity.chain) as (typeof wagmiConfig)['chains'][number]['id'],
    abi: initFundEntity.vault.contractAbi,
    address: initFundEntity.vault.contractAddress as `0x${string}`,
    functionName: 'stakeRecord',
    args: [sftId],
    account: walletAccount.address!,
    query: {
      enabled: !isSftIdLoading && sftId !== undefined
    }
  })

  const {
    data: vaultStakedEarningInfo,
    refetch: refetchVaultStakedEarningInfo,
    isLoading: isVaultStakedEarningInfoLoading
  } = useReadContract({
    chainId: getChainId(initFundEntity.chain) as (typeof wagmiConfig)['chains'][number]['id'],
    abi: initFundEntity.vault.contractAbi,
    address: initFundEntity.vault.contractAddress as `0x${string}`,
    functionName: 'earningInfo',
    args: [walletAccount.address!, sftId],
    account: walletAccount.address!,
    query: {
      enabled: !isSftIdLoading && sftId !== undefined
    }
  })

  const { data: unStakeSftHash, isPending: isUnStakeSftPending, writeContract: unStakeSft } = useWriteContract()

  const { isLoading: isUnStakeSftConfirming } = useWaitForTransactionReceipt({
    chainId: getChainId(initFundEntity.chain) as (typeof wagmiConfig)['chains'][number]['id'],
    hash: unStakeSftHash
  })

  // ** Vars
  const formattedSftValue = BigInt(Number(sftValue ?? 0)) / 10n ** 18n
  const sftSlot = initFundEntity.defaultPackages?.data.find(pkg => pkg.id === Number(sftSlotId))
  const fundBaseCurrencyProperties = getFundCurrencyProperties(initFundEntity.baseCurrency)

  const stakeRecordStartDate = vaultStakeRecord
    ? format(new Date((vaultStakeRecord as StakeRecordType)[3] * 1_000), 'PPp')
    : '-'

  const stakeRecordUnlockDate = vaultStakeRecord
    ? format(new Date((vaultStakeRecord as StakeRecordType)[4] * 1_000), 'PPp')
    : '-'

  // ** Side Effects
  if (isSftIdLoading || isSftValueLoading || isSftSlotIdLoading) {
    return <PublicFundLiveStakedSFTSkeletonCard />
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={4} alignItems='center' justifyContent='center' sx={{ position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 0, right: 8 }}>
            <CustomChip
              skin='light'
              size='medium'
              label={`# ${sftId ?? '-'}`}
              color='success'
              sx={{
                height: 20,
                fontWeight: 600,
                borderRadius: '5px',
                fontSize: '0.875rem',
                textTransform: 'capitalize',
                '& .MuiChip-label': { mt: -0.25 }
              }}
            />
          </Box>
          <Box
            sx={{
              minHeight: theme => theme.spacing(64),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& img:hover': {
                cursor: 'pointer'
              }
            }}
          >
            <Atropos>
              <Image
                width={180}
                height={256}
                draggable={false}
                alt={sftSlot?.attributes.displayName ?? 'SFT Slot'}
                src={`/images/funds/packages/card-skin/${sftSlot?.attributes.skin.toLowerCase()}-${
                  theme.palette.mode
                }.webp`}
              />
            </Atropos>
          </Box>
          <Stack spacing={4} alignSelf='stretch'>
            <Stack direction='row' spacing={2} flexWrap='wrap' justifyContent='space-between'>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Typography variant='h5' component='p'>
                  {sftSlot?.attributes.displayName}
                </Typography>
              </Stack>
              <Stack direction='row' sx={{ position: 'relative' }}>
                <Sup>{fundBaseCurrencyProperties.symbol}</Sup>
                <Typography
                  variant='h4'
                  component='p'
                  sx={{
                    mb: -1.2,
                    ml: 2,
                    lineHeight: 1,
                    color: 'primary.main'
                  }}
                >
                  {getFormattedPriceUnit(formattedSftValue ?? 0)}
                </Typography>
              </Stack>
            </Stack>

            <Box>
              <Typography variant='body2'>{sftSlot?.attributes.description || 'No description'}</Typography>
            </Box>
            <Box>
              <Divider />
            </Box>
            <Stack spacing={2} justifyContent='center'>
              <Typography variant='subtitle2' component='p'>
                Utility
              </Typography>

              <Stack spacing={2} alignSelf='stretch'>
                {sftSlot?.attributes.slot.map(property => {
                  return (
                    <Stack
                      key={`slot-${property.id}`}
                      direction='row'
                      alignItems='center'
                      justifyContent='space-between'
                    >
                      <Typography variant='subtitle1' component='p'>
                        {property.propertyType}
                      </Typography>
                      <Typography variant='subtitle1' component='p' sx={{ fontWeight: 600 }}>
                        {property.value}
                      </Typography>
                    </Stack>
                  )
                })}
              </Stack>
            </Stack>
            <Stack spacing={2} justifyContent='center'>
              <Typography variant='subtitle2' component='p'>
                Stake Information
              </Typography>

              <Stack spacing={2} alignSelf='stretch'>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                  <Typography variant='subtitle1' component='p'>
                    Stake Start Date
                  </Typography>
                  {isVaultStakeRecordLoading ? (
                    <Stack direction='row' spacing={2} alignItems='center' justifyContent='center'>
                      <Skeleton variant='text' width={120} />
                    </Stack>
                  ) : (
                    <Typography variant='subtitle1' component='p' sx={{ fontWeight: 600 }}>
                      {stakeRecordStartDate}
                    </Typography>
                  )}
                </Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                  <Typography variant='subtitle1' component='p'>
                    Stake Unlock Date
                  </Typography>
                  {isVaultStakeRecordLoading ? (
                    <Stack direction='row' spacing={2} alignItems='center' justifyContent='center'>
                      <Skeleton variant='text' width={120} />
                    </Stack>
                  ) : (
                    <Typography variant='subtitle1' component='p' sx={{ fontWeight: 600 }}>
                      {stakeRecordUnlockDate}
                    </Typography>
                  )}
                </Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                  <Typography variant='subtitle1' component='p'>
                    Earned
                  </Typography>
                  <Stack direction='row' spacing={2} alignItems='center' justifyContent='center'>
                    {isVaultStakedEarningInfoLoading ? (
                      <Stack direction='row' spacing={2} alignItems='center' justifyContent='center'>
                        <Skeleton variant='text' width={120} />
                        <Skeleton variant='circular' width={28} height={28} />
                      </Stack>
                    ) : (
                      <Stack direction='row' spacing={2} alignItems='center' justifyContent='center'>
                        <Typography
                          variant='subtitle1'
                          component='p'
                          sx={{ fontWeight: 600 }}
                        >{`${fundBaseCurrencyProperties.symbol} ${getFormattedPriceUnit(
                          Number(vaultStakedEarningInfo ?? 0) / 10 ** 18
                        )} ${fundBaseCurrencyProperties.currency}`}</Typography>
                        <IconButton size='small' onClick={() => refetchVaultStakedEarningInfo()}>
                          <Icon icon='mdi:reload' fontSize={16} />
                        </IconButton>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <Stack spacing={2} sx={{ mt: 'auto' }}>
              <Divider />
              <Button fullWidth variant='contained'>
                Claim
              </Button>
              <LoadingButton
                fullWidth
                loading={isUnStakeSftPending || isUnStakeSftConfirming}
                variant='contained'
                onClick={() => {
                  unStakeSft(
                    {
                      chainId: getChainId(initFundEntity.chain) as (typeof wagmiConfig)['chains'][number]['id'],
                      abi: initFundEntity.vault.contractAbi,
                      address: initFundEntity.vault.contractAddress as `0x${string}`,
                      functionName: 'unstake',
                      args: [[sftId]],
                      account: walletAccount.address!
                    },
                    {
                      onError: () => {
                        toast.error('Failed to un stake sft')
                      }
                    }
                  )
                }}
              >
                UnStake
              </LoadingButton>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default PublicFundLiveStakedSFTCard