import { useEffect, useRef } from 'react'
import { CAlert } from '@coreui/react'

const FeedbackAlert = ({ feedback, onClose }) => {
  const alertRef = useRef(null)

  useEffect(() => {
    if (!feedback) return

    alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [feedback])

  if (!feedback) return null

  return (
    <div ref={alertRef}>
      <CAlert color={feedback.color} dismissible onClose={onClose}>
        {feedback.message}
      </CAlert>
    </div>
  )
}

export default FeedbackAlert
