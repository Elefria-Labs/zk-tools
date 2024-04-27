import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
} from '@chakra-ui/react';
import { integerList } from '@data/integer-list';
import { CopyIcon } from '@chakra-ui/icons';
import { handleCopyClick } from '@utils/wallet';
import { ethers } from 'ethers';

function Cheatsheet() {
  const [minMaxValue, setMinMaxValue] = useState<{
    min?: string;
    max: string;
  } | null>();
  const [intType, setIntType] = useState<string | undefined>('uint8');
  const [bits, setBits] = useState<number | null>(8);

  const getMaxMinValue = useCallback((bits: number, intType: string) => {
    if (intType.includes('uint') == false) {
      const min = ethers.BigNumber.from('2')
        .pow(BigInt(bits - 1))
        .mul(-1)
        .toString();
      const max = ethers.BigNumber.from('2')
        .pow(BigInt(bits - 1))
        .sub(1)
        .toString();
      setMinMaxValue({ min, max });
      return;
    }
    const maxValue = ethers.BigNumber.from('2').pow(BigInt(bits)).sub(1);
    setMinMaxValue({ max: maxValue.toString() });
  }, []);
  useEffect(() => {
    if (!bits || !intType) {
      return;
    }
    getMaxMinValue(bits, intType);
  }, [bits, intType, getMaxMinValue]);

  return (
    <Box w="100%">
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Integer Type</FormLabel>
          <Select
            placeholder="Select option"
            defaultValue={8}
            onChange={(e) => {
              setBits(Number(e.target.value));

              setIntType(e.target.selectedOptions?.[0]?.text);
            }}
          >
            {integerList.map((o) => (
              <option key={o.option} value={o.value}>
                {o.option}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          {minMaxValue?.min && (
            <>
              <FormLabel>Min Value</FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  minWidth={[100, 400]}
                  value={minMaxValue?.min}
                  disabled
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Copy int value"
                    icon={<CopyIcon />}
                    onClick={() => handleCopyClick(minMaxValue.min)}
                  />
                </InputRightElement>
              </InputGroup>
            </>
          )}
          {minMaxValue?.max && (
            <>
              <FormLabel>Max Value</FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  minWidth={[100, 400]}
                  value={minMaxValue?.max}
                  disabled
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Copy int value"
                    icon={<CopyIcon />}
                    onClick={() => handleCopyClick(minMaxValue.max)}
                  />
                </InputRightElement>
              </InputGroup>
            </>
          )}
        </FormControl>
      </Stack>
    </Box>
  );
}

export default Cheatsheet;
