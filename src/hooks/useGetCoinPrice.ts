import { useState, useEffect } from 'react';
import axios from 'axios';

export interface CoinbaseResponse {
  data: {
    amount: string;
    base: string;
    currency: string;
  };
}

export const useGetCoinPrice = (coins: string[]) => {
  const [data, setData] = useState<CoinbaseResponse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = coins.map((c) =>
          axios.get<CoinbaseResponse>(
            `https://api.coinbase.com/v2/prices/${c}-USD/spot`,
          ),
        );
        const coinPrices = (await Promise.all(responses)).map((r) => r.data);
        setData(coinPrices);
      } catch (error) {
        setError('Error fetching data from Coinbase API');
      } finally {
        setLoading(false);
      }
    };
    if (coins.length > 0 && data == null) {
      fetchData();
    }
  }, [coins, data]);

  return { data, loading, error };
};
