// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Collapse from '@mui/material/Collapse'
import { TransitionGroup } from 'react-transition-group'

// ** API Imports
import { useFindQuery } from 'src/store/api/management/review'

// ** Custom Component Imports
import ReviewListLoadingSkeleton from 'src/views/management/request-sheet/edit/cards/review/shared/LoadingSkeleton'
import AddReviewForm from 'src/views/management/request-sheet/edit/cards/review/shared/AddReviewForm'
import ReviewListEditForm from 'src/views/management/request-sheet/edit/cards/review/shared/EditForm'

// ** Type Imports
import { RequestSheetType } from 'src/types/api/requestSheetTypes'

interface Props {
  initRequestSheetEntity: RequestSheetType
}

const SecondaryReviewEditCard = (props: Props) => {
  // ** Props
  const { initRequestSheetEntity } = props

  // ** Hooks
  const { data: reviewsData, isLoading: isReviewListLoading } = useFindQuery({
    filters: {
      requestSheet: initRequestSheetEntity.id,
      processStatus: 'Secondary review'
    },
    pagination: {
      page: 1,
      pageSize: 25
    }
  })

  // ** Vars
  const reviews = reviewsData?.data || []

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            複審建議
          </Typography>
        }
        subheader={<Typography variant='subtitle2'>請依據申請書內容提供意見</Typography>}
      />
      <CardContent>
        <Stack spacing={4}>
          <AddReviewForm initRequestSheetEntity={initRequestSheetEntity} currentProcessStatus='Secondary review' />

          {isReviewListLoading ? (
            <ReviewListLoadingSkeleton />
          ) : (
            <TransitionGroup>
              {reviews.map(review => (
                <Collapse key={`review-${review.id}`} sx={{ mb: 4 }}>
                  <ReviewListEditForm initReviewEntity={review} />
                </Collapse>
              ))}
            </TransitionGroup>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default SecondaryReviewEditCard
