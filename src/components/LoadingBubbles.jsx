import React from 'react'

function LoadingBubbles() {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-white font-medium">Coming soon...</h1>
      <div className="w-10 h-10 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <circle transform="translate(8 0)" cx="0" cy="16" r="0" fill="red">
            <animate
              attributeName="r"
              values="0; 4; 0; 0"
              dur="1.2s"
              repeatCount="indefinite"
              begin="0"
              keyTimes="0;0.2;0.7;1"
              keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
              calcMode="spline"
            />
          </circle>
          <circle transform="translate(16 0)" cx="0" cy="16" r="0" fill="blue">
            <animate
              attributeName="r"
              values="0; 4; 0; 0"
              dur="1.2s"
              repeatCount="indefinite"
              begin="0.3"
              keyTimes="0;0.2;0.7;1"
              keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
              calcMode="spline"
            />
          </circle>
          <circle transform="translate(24 0)" cx="0" cy="16" r="0" fill="green">
            <animate
              attributeName="r"
              values="0; 4; 0; 0"
              dur="1.2s"
              repeatCount="indefinite"
              begin="0.6"
              keyTimes="0;0.2;0.7;1"
              keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
              calcMode="spline"
            />
          </circle>
        </svg>
      </div>
    </div>
  )
}

export default LoadingBubbles
