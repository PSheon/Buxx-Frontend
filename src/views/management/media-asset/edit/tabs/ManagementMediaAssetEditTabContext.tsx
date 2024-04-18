// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

// ** Custom Component Imports
import ManagementMediaAssetEditPreviewCard from 'src/views/management/media-asset/edit/cards/ManagementMediaAssetEditPreviewCard'
import ManagementMediaAssetEditShareCard from 'src/views/management/media-asset/edit/cards/ManagementMediaAssetEditShareCard'
import ManagementMediaAssetEditDangerZoneCard from 'src/views/management/media-asset/edit/cards/ManagementMediaAssetEditDangerZoneCard'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Imports
import { MediaAssetType } from 'src/types/api/mediaAssetTypes'

// ** Styled Tab Component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

interface Props {
  initMediaAssetEntity: MediaAssetType
}

const ManagementMediaAssetEditTabContext = (props: Props) => {
  // ** Props
  const { initMediaAssetEntity } = props

  // ** States
  const [activeTab, setActiveTab] = useState<string>('overview')

  // ** Logics
  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value='overview' label='概覽' icon={<Icon icon='mdi:account-outline' />} />
        <Tab value='security' label='安全' icon={<Icon icon='mdi:lock-outline' />} />
      </TabList>
      <Box sx={{ mt: 6 }}>
        <TabPanel sx={{ p: 0 }} value='overview'>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <ManagementMediaAssetEditPreviewCard initMediaAssetEntity={initMediaAssetEntity} />
            </Grid>
            <Grid item xs={12}>
              <ManagementMediaAssetEditShareCard initMediaAssetEntity={initMediaAssetEntity} />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='security'>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <ManagementMediaAssetEditDangerZoneCard initMediaAssetEntity={initMediaAssetEntity} />
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
    </TabContext>
  )
}

export default ManagementMediaAssetEditTabContext