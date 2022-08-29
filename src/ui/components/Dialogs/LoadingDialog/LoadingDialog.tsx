import './LoadingDialog.module.css'

interface LoadingDialogProps {
  loadingMessage?: string
}

export default function LoadingDialog({ loadingMessage }: LoadingDialogProps) {
  return (
    <div className='loading-page'>
      <img height={350} src='/img/dancing_4.gif' alt='success' />
      <h1 className='loading-message'>{loadingMessage || 'Chargement...'}</h1>
    </div>
  )
}
