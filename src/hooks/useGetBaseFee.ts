import { useState, useEffect } from 'react';
import axios from 'axios';

export interface CoinbaseResponse {
  data: {
    amount: string;
    base: string;
    currency: string;
  };
}

export const useGetBaseFee = () => {
  const [gasDetails, setGasDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await axios.get<any>(
          `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
        );

        setGasDetails(responses);
      } catch (error) {
        setError('Error fetching data from Coinbase API');
      } finally {
        setLoading(false);
      }
    };

    if (!gasDetails?.data) {
      fetchData();
    }
  }, [gasDetails]);

  return { gasDetails, loading, error };
};
