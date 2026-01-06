import { useEffect, useState } from "react"

export function useWalletBalance(address: string | null) {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!address) return

    setLoading(true)

    // TEMP placeholder
    setTimeout(() => {
      setBalance(0)
      setLoading(false)
    }, 300)
  }, [address])

  return {
    balance,
    loading
  }
}
