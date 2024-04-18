// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Image from 'next/image'

// ** MUI Components
import { styled, useTheme } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Grid, { GridProps } from '@mui/material/Grid'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Third-Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import safePrice from 'currency.js'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Core Component Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Util Imports
import { getFundCurrencyProperties, getPackageStatusProperties } from 'src/utils'

// ** Type Imports
import { FundType } from 'src/types/api/fundTypes'
import { PackageType } from 'src/types/api/packageTypes'

// ** Styled Grid Component
const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('md')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

// ** Styled <sup> Component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

const schema = yup.object().shape({
  quantity: yup.number().min(1).max(10).required()
})

interface Props {
  initFundEntity: FundType
}
interface FormData {
  quantity: number
}

const ReviewFundPreviewDefaultPackageGrid = (props: Props) => {
  // ** Props
  const { initFundEntity } = props

  // ** States
  const [openMint, setOpenMint] = useState<boolean>(false)
  const [selectedPackageEntity, setSelectedPackageEntity] = useState<PackageType | null>(null)
  const [mintQuantity, setMintQuantity] = useState<number>(1)

  // ** Hooks
  const theme = useTheme()
  const { reset, control, handleSubmit } = useForm({
    defaultValues: {
      quantity: 0
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // ** Vars
  const { defaultPackages: defaultPackagesData } = initFundEntity
  const publishedDefaultPackages = defaultPackagesData?.data
    ?.map(pkg => ({ id: pkg.id, ...pkg.attributes }))
    ?.filter(pkg => pkg.status === 'Published')
  const fundBaseCurrencyProperties = getFundCurrencyProperties(initFundEntity.baseCurrency)

  // ** Logics
  const handleMintOpen = (packageEntity: PackageType) => {
    setSelectedPackageEntity(() => packageEntity)
    reset({
      quantity: 1
    })
    setOpenMint(true)
  }
  const handleMintClose = () => {
    setSelectedPackageEntity(() => null)
    reset({
      quantity: 1
    })
    setOpenMint(false)
  }
  const onSubmit = async (data: FormData) => {
    const { quantity } = data

    console.log(
      '🚀 ~ src/views/review/fund/preview/grids/ReviewFundPreviewDefaultPackageGrid.tsx:134 > quantity',
      quantity
    )
    reset(undefined, { keepValues: true, keepDirty: false, keepDefaultValues: false })
    handleMintClose()
  }

  // ** Renders
  if (!publishedDefaultPackages || publishedDefaultPackages?.length === 0) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <CustomAvatar skin='light' sx={{ width: 56, height: 56, mb: 2 }}>
                <Icon icon='mdi:exclamation-thick' fontSize='2rem' />
              </CustomAvatar>
              <Typography variant='h6' sx={{ mb: 2 }}>
                注意
              </Typography>
              <Typography variant='body2'>項目方尚未新增方案</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      {publishedDefaultPackages.map(defaultPackage => {
        const packageStatusProperties = getPackageStatusProperties(defaultPackage.status)

        return (
          <Grid key={`default-package-${defaultPackage.id}`} item xs={12}>
            <Card>
              <Grid container spacing={6}>
                <StyledGrid item md={5} xs={12} sx={{ position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: theme => theme.spacing(12), right: 16 }}>
                    <CustomChip
                      skin='light'
                      size='medium'
                      label={packageStatusProperties.displayName}
                      color={packageStatusProperties.color}
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
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      width={180}
                      height={256}
                      alt={defaultPackage.displayName}
                      src={`/images/funds/packages/card-skin/${defaultPackage.skin}-${theme.palette.mode}.webp`}
                    />
                  </CardContent>
                </StyledGrid>
                <Grid
                  item
                  md={7}
                  xs={12}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    pt: theme => ['0 !important', '0 !important', `${theme.spacing(6)} !important`],
                    pl: theme => [`${theme.spacing(6)} !important`, `${theme.spacing(6)} !important`, '0 !important']
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                      <Stack direction='row' spacing={2} alignItems='center'>
                        <Box>
                          <CustomChip
                            skin='light'
                            size='medium'
                            label={<Typography variant='subtitle1'>{`#${defaultPackage.packageId}`}</Typography>}
                            color='secondary'
                            sx={{
                              height: 20,
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              alignSelf: 'flex-start',
                              color: 'text.secondary'
                            }}
                          />
                        </Box>
                        <Typography variant='h6'>{defaultPackage.displayName}</Typography>
                      </Stack>

                      <Stack direction='row' sx={{ position: 'relative' }}>
                        <Sup>{fundBaseCurrencyProperties.symbol}</Sup>
                        <Typography
                          variant='h3'
                          sx={{
                            mb: -1.2,
                            ml: 2,
                            lineHeight: 1,
                            color: 'primary.main'
                          }}
                        >
                          {defaultPackage.priceInUnit}
                        </Typography>
                      </Stack>
                    </Box>
                    <Typography variant='body2' sx={{ mb: 2 }}>
                      {defaultPackage.description || 'No description'}
                    </Typography>
                    <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />

                    <Stack spacing={2} justifyContent='center' sx={{ mb: 2 }}>
                      <Typography variant='subtitle2'>赋能</Typography>

                      {defaultPackage.slot?.length === 0 ? (
                        <Typography sx={{ mb: 2 }}>尚未設定內容</Typography>
                      ) : (
                        defaultPackage.slot.map(property => {
                          return (
                            <Typography key={`slot-${property.id}`} sx={{ mb: 2 }}>
                              {`${property.propertyType}:`}
                              <Box component='span' sx={{ fontWeight: 600 }}>
                                {property.value}
                              </Box>
                            </Typography>
                          )
                        })
                      )}
                    </Stack>
                  </CardContent>
                  <CardActions className='card-action-dense' sx={{ mt: 'auto' }}>
                    <Button
                      variant='contained'
                      onClick={() => {
                        handleMintOpen(defaultPackage)
                      }}
                    >
                      鑄造方案
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )
      })}

      <Dialog fullWidth maxWidth='sm' open={openMint} onClose={handleMintClose}>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              position: 'relative',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <IconButton
              size='small'
              onClick={handleMintClose}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                {`鑄造方案 #${selectedPackageEntity?.packageId}`}
              </Typography>
              <Typography variant='body2'>請確認您選擇的方案內容及數量.</Typography>
            </Box>
          </DialogContent>
          <DialogContent sx={{ px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`] }}>
            <Stack spacing={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  width={180}
                  height={256}
                  alt={selectedPackageEntity?.displayName || ''}
                  src={`/images/funds/packages/card-skin/${selectedPackageEntity?.skin}-${theme.palette.mode}.webp`}
                />
              </Box>
              <Stack spacing={2} divider={<Divider orientation='horizontal' flexItem />}>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                  <Typography variant='subtitle1'>Price</Typography>
                  <Typography variant='h5'>{`${fundBaseCurrencyProperties.symbol} ${selectedPackageEntity?.priceInUnit} ${fundBaseCurrencyProperties.currency}`}</Typography>
                </Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                  <Typography variant='subtitle1'>Quantity</Typography>
                  <Controller
                    name='quantity'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Stack
                        direction='row'
                        spacing={4}
                        alignItems='center'
                        sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                      >
                        <IconButton
                          size='large'
                          onClick={() => {
                            setMintQuantity(() => Math.max(value - 1, 1))
                            onChange(Math.max(value - 1, 1))
                          }}
                        >
                          <Icon icon='mdi:minus-box-outline' />
                        </IconButton>
                        <Typography variant='h6'>{value}</Typography>
                        <IconButton
                          size='large'
                          onClick={() => {
                            setMintQuantity(() => Math.min(value + 1, 10))
                            onChange(Math.min(value + 1, 10))
                          }}
                        >
                          <Icon icon='mdi:plus-box-outline' />
                        </IconButton>
                      </Stack>
                    )}
                  />

                  <Typography variant='h5'>{`${fundBaseCurrencyProperties.symbol} ${safePrice(
                    selectedPackageEntity?.priceInUnit ?? 0
                  ).multiply(mintQuantity)}`}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions
            sx={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Typography variant='subtitle1' textAlign='center' color='error' sx={{ pb: 4 }}>
              無法在預覽模式下鑄造
            </Typography>
            <LoadingButton
              fullWidth
              disabled
              type='submit'
              variant='contained'
              startIcon={<Icon icon='mdi:medical-bag' />}
            >
              確認鑄造
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

export default ReviewFundPreviewDefaultPackageGrid