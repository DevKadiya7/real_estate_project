import { memo } from 'react'
import { AlertIcon } from './Icons'

const normalizeMessage = (message) => {
  if (Array.isArray(message)) {
    return message.filter(Boolean)
  }

  if (!message) {
    return []
  }

  return [message]
}

export const ErrorMessage = memo(({ message }) => {
  const messages = normalizeMessage(message)

  if (messages.length === 0) {
    return null
  }

  return (
    <div className="alert alert--error" role="alert" aria-live="assertive">
      <AlertIcon />
      <div>
        {messages.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  )
})

export default ErrorMessage