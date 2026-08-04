import { Card, CardHeader } from '../components/ui/Card'
import { useMetadataOptions } from '../hooks/useMetadataOptions'
import { usePredictMutation } from '../features/price-predictor/hooks/usePredictMutation'
import { PredictorForm } from '../features/price-predictor/components/PredictorForm'
import { PredictionResult } from '../features/price-predictor/components/PredictionResult'

export function PredictorPage() {
  const { data: options, isLoading: isLoadingOptions } = useMetadataOptions()
  const { mutate, data: result, isPending } = usePredictMutation()

  return (
    <Card>
      <CardHeader
        eyebrow="Prediction"
        title="Price Predictor"
        description="Fill in the property details and get the estimated range from the backend pipeline."
      />
      <PredictorForm options={options} isLoadingOptions={isLoadingOptions} onSubmit={mutate} isSubmitting={isPending} />
      <PredictionResult result={result} />
    </Card>
  )
}
