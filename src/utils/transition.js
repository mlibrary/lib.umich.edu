import { keyframes } from '@emotion/react'

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

export default function getTransitionCSS(speed = "0.25") {
  return {
    animation: `${fadeIn} ${speed}s ease-in`
  }
}