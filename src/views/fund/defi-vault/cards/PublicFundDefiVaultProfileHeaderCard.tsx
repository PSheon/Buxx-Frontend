// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import { styled } from '@mui/material/styles'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// ** Third-Party Imports
import { useAccount } from 'wagmi'

// ** Core Component Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Util Imports
import { getFundCategoryProperties, getPublicMediaAssetUrl, getFundCurrencyProperties } from 'src/utils'

// ** Type Imports
import type { DVFundType } from 'src/types/dvFundTypes'
import type { MediaAssetType } from 'src/types/mediaAssetTypes'

interface Props {
  initDVFundEntity: DVFundType
}

const FundAvatarGroup = styled(AvatarGroup)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const PublicFundDefiVaultProfileHeaderCard = (props: Props) => {
  // ** Props
  const { initDVFundEntity } = props

  // ** Hooks
  const walletAccount = useAccount()

  // ** Vars
  const fundCategoryProperties = getFundCategoryProperties(initDVFundEntity.category)
  const fundBaseCurrencyProperties = getFundCurrencyProperties(initDVFundEntity.baseCurrency)

  const currentBannerMediaAsset = initDVFundEntity.banner?.data?.id
    ? ({
        id: initDVFundEntity.banner.data.id,
        ...initDVFundEntity.banner.data.attributes
      } as MediaAssetType)
    : null

  return (
    <Card>
      <CardMedia
        component='img'
        alt='banner'
        image={
          currentBannerMediaAsset
            ? getPublicMediaAssetUrl(currentBannerMediaAsset.formats?.thumbnail?.url)
            : '/images/pages/profile-banner.webp'
        }
        sx={{ height: { xs: 150, md: 250 } }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        <FundAvatarGroup className='pull-up'>
          <Tooltip title={fundBaseCurrencyProperties.displayName}>
            <CustomAvatar
              src={fundBaseCurrencyProperties.imageUrl}
              alt={fundBaseCurrencyProperties.displayName}
              sx={{
                height: 120,
                width: 120,
                borderWidth: '5px !important',
                backgroundColor: theme => theme.palette.background.default
              }}
            />
          </Tooltip>
          <Tooltip title='RWA'>
            <CustomAvatar
              src='/images/funds/rwa.png'
              alt='rwa'
              sx={{
                height: 120,
                width: 120,
                borderWidth: '5px !important',
                backgroundColor: theme => theme.palette.background.default
              }}
            />
          </Tooltip>
        </FundAvatarGroup>
        <Stack
          direction='row'
          flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
          alignItems='flex-start'
          justifyContent={{ xs: 'center', sm: 'space-between' }}
          sx={{ width: '100%', ml: { xs: 0, md: 6 } }}
        >
          <Stack
            spacing={4}
            alignSelf='flex-end'
            alignItems={{
              xs: 'center',
              sm: 'flex-start'
            }}
            sx={{ mb: { xs: 6, sm: 0 } }}
          >
            <Typography variant='h5' textAlign={{ xs: 'center', sm: 'left' }} sx={{ fontSize: '1.375rem' }}>
              {initDVFundEntity.displayName}
            </Typography>
            <Stack direction='row' spacing={4} flexWrap='wrap' justifyContent={['center', 'flex-start']}>
              <Stack
                direction='row'
                spacing={2}
                alignItems='center'
                justifyContent='center'
                sx={{ '& svg': { color: 'text.secondary' } }}
              >
                <Icon icon='mdi:map-marker-outline' />
                <Typography color='text.secondary' sx={{ fontWeight: 600 }}>
                  {initDVFundEntity.chain}
                </Typography>
              </Stack>
              <Stack
                direction='row'
                spacing={2}
                alignItems='center'
                justifyContent='center'
                sx={{ '& svg': { color: 'text.secondary' } }}
              >
                <Icon icon='mdi:category-plus-outline' />
                <Typography color='text.secondary' sx={{ fontWeight: 600 }}>
                  {fundCategoryProperties.displayName}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack direction='row' spacing={2} alignItems='center' justifyContent='center'>
            {initDVFundEntity.twitterUrl && (
              <Button color='info' variant='contained' sx={{ p: 1.5, minWidth: 38 }}>
                <Icon icon='mdi:twitter' fontSize={20} />
              </Button>
            )}
            {initDVFundEntity.discordUrl && (
              <Button color='primary' variant='contained' sx={{ p: 1.5, minWidth: 38 }}>
                <Icon icon='ic:outline-discord' fontSize={20} />
              </Button>
            )}
            {walletAccount.chain?.blockExplorers?.default.url && (
              <Button
                color='primary'
                variant='outlined'
                component={Link}
                target='_blank'
                href={`${walletAccount?.chain?.blockExplorers?.default.url}/address/${initDVFundEntity.vault.contractAddress}`}
                sx={{ p: 1.5, minWidth: 38 }}
              >
                <Icon icon='mdi:explore-nearby' fontSize={20} />
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default PublicFundDefiVaultProfileHeaderCard
