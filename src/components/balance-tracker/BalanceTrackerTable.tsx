import {
  Card,
  CardBody,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ChainBalance } from './utils';

type BalanceTrackerTableProps = {
  chainBalances: Record<string, ChainBalance>[];
};

export default function BalanceTrackerTable(props: BalanceTrackerTableProps) {
  const { chainBalances } = props;
  return (
    <>
      {chainBalances.map((addressBalances, i) => (
        <Card key={i} mt={4} border={'1px solid gray'}>
          <CardBody>
            <Text size="xl">
              <strong>
                Address:{' '}
                {addressBalances[Object.keys(addressBalances)?.[0]!]?.address}
              </strong>
            </Text>
            {Object.keys(addressBalances).map((key) => (
              <Card key={key} mt={4} border={'1px solid gray'}>
                <CardBody>
                  <Flex justifyContent="space-between">
                    <Text size="xl" fontStyle="bold">
                      Network: {addressBalances[key]?.networkName}
                    </Text>
                    <Text size="xl" fontStyle="bold">
                      Balance: {addressBalances[key]?.balance}
                    </Text>
                  </Flex>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Token</Th>
                          <Th isNumeric>Balance</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {addressBalances[key]?.tokens.length == 0 && (
                          <Tr>
                            <Td>-</Td>
                            <Td>-</Td>
                          </Tr>
                        )}
                        {addressBalances[key]?.tokens.map((token) => (
                          <Tr key={token.name}>
                            <Td>{`${token.name} (${token.symbol})`}</Td>
                            <Td>{token.balance}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                      {/* <Tfoot>
          <Tr>
            <Th>To convert</Th>
            <Th isNumeric>multiply by</Th>
          </Tr>
        </Tfoot> */}
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            ))}
          </CardBody>
        </Card>
      ))}
    </>
  );
}
