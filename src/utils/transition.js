import { keyframes } from '@emotion/core'

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

export default function getTransitionCSS() {
  return {
    animation: `${fadeIn} 0.5s ease-in`
  }
}