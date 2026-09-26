import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('<App />', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(() => {
    cleanup()
  })

  it('renders the title and starting essence', () => {
    render(<App />)
    expect(screen.getByText('Idle Ascension')).toBeInTheDocument()
    expect(screen.getByTestId('essence')).toHaveTextContent('0')
  })

  it('grants essence when channeling', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('channel'))
    expect(screen.getByTestId('essence')).toHaveTextContent('1')
  })

  it('lets the player buy an affordable generator', () => {
    render(<App />)
    const channelBtn = screen.getByTestId('channel')
    // Acolyte costs 10; channel 10 times.
    for (let i = 0; i < 10; i++) fireEvent.click(channelBtn)
    fireEvent.click(screen.getByTestId('buy-acolyte'))
    expect(screen.getByTestId('owned-acolyte')).toHaveTextContent('×1')
  })
})
