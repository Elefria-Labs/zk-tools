import { Grid, GridItem, Box, Text, Link } from '@chakra-ui/react';
import { Item } from '@data/playground';

interface ListComponentProps {
  items: Item[];
}

export const PlaygroundListComponent = ({ items }: ListComponentProps) => {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {items.map((item: Item, i: number) => (
        <Link key={i} href={item.link}>
          <GridItem>
            <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                {item.title}
              </Text>
              <Text>{item.description}</Text>
            </Box>
          </GridItem>
        </Link>
      ))}
    </Grid>
  );
};
