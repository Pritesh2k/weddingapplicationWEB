'use client'

import React from 'react'

interface State { hasError: boolean }

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  State
> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <p className="text-2xl mb-3">💍</p>
          <h1 className="text-lg font-bold mb-2">Something went wrong</h1>
          <p className="text-sm text-gray-500 mb-6">Please refresh the page to try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#8B6B47] text-white"
          >
            Refresh
          </button>
        </div>
      )
    }
    return this.props.children
  }
}