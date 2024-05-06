// ** React Imports
import { useState, useEffect, SyntheticEvent } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

// ** Custom Component Imports
import PublicFundLiveOverviewTabPanel from 'src/views/fund/live/tabs/PublicFundLiveOverviewTabPanel'
import PublicFundLiveVaultTabPanel from 'src/views/fund/live/tabs/PublicFundLiveVaultTabPanel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Imports
import { PreviewTabIndex, FundType } from 'src/types/api/fundTypes'

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('sm')]: {
      minWidth: 130
    }
  }
}))

interface Props {
  initFundEntity: FundType
  tab: PreviewTabIndex
}

const PublicFundLiveTabContext = (props: Props) => {
  // ** Props
  const { initFundEntity, tab } = props

  // ** States
  const [activeTab, setActiveTab] = useState<PreviewTabIndex>(tab)
  const [isTabLoading, setIsTabLoading] = useState<boolean>(false)

  // ** Hooks
  const router = useRouter()

  // ** Logics
  const handleChangeTab = (event: SyntheticEvent, newTabIndex: string) => {
    setIsTabLoading(true)
    router.push(`/fund/live/${initFundEntity.id}/${newTabIndex.toLowerCase()}`).then(() => setIsTabLoading(false))
  }

  // ** Side Effects
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChangeTab}
            aria-label='public fund live tabs'
          >
            <Tab
              value='overview'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon icon='mdi:chart-arc' />
                  Overview
                </Box>
              }
            />
            <Tab
              value='vault'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon icon='ph:vault-bold' />
                  Vault
                </Box>
              }
            />
          </TabList>
        </Grid>
        {isTabLoading ? (
          <Grid item xs={12}>
            <Box sx={{ py: 40, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Loading...</Typography>
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <PublicFundLiveOverviewTabPanel initFundEntity={initFundEntity} />
            <PublicFundLiveVaultTabPanel initFundEntity={initFundEntity} />
          </Grid>
        )}
      </Grid>
    </TabContext>
  )
}

export default PublicFundLiveTabContext