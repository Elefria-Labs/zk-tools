import React from 'react';
import {
  Flex,
  Input,
  Slide,
  useDisclosure,
  IconButton,
  Text,
  Stack,
} from '@chakra-ui/react';
import { CloseIcon, SearchIcon } from '@chakra-ui/icons';

export default function ToolSearchInput() {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Flex>
      <IconButton
        aria-label="Search evm tools"
        onClick={onToggle}
        size="md"
        icon={<SearchIcon />}
      />
      <Slide direction="top" in={isOpen} style={{ zIndex: 10 }}>
        <Stack p="16px" bg="gray.300" rounded="md" shadow="md">
          <Text>Search Tools</Text>
          <Flex justifyContent={'space-between'}>
            <Input type="text" placeholder="tool name" />
            <IconButton
              aria-label="Search evm tools"
              onClick={onToggle}
              size="md"
              icon={<CloseIcon color={'red'} />}
            />
          </Flex>
        </Stack>
      </Slide>
    </Flex>
  );
}
