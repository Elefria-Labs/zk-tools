import { Grid } from '@chakra-ui/react';
import { HomeCard } from '@components/home/HomeCard';
import { Item } from '@data/playground';

type ListComponentProps = {
  items: Item[];
};

export const PlaygroundListComponent = (props: ListComponentProps) => {
  const { items } = props;
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {items.map((item: Item) => (
        <HomeCard {...item} key={item.title} />
      ))}
    </Grid>
  );
};
