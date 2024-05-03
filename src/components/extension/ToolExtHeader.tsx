import React from 'react';
import {
  Card,
  CardBody,
  Flex,
  IconButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import GasPrice from './GasPrice';
import ToolExtMenuDrawer from './ToolExtMenuDrawer';

export default function ToolExtHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);
  return (
    <Flex alignItems="center">
      <Card w="100%" roundedTop={0}>
        <CardBody p={4} py={2}>
          <Flex justifyContent="flex-end" alignItems="center">
            <GasPrice />
            <Button
              ml={8}
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
              ref={btnRef}
              onClick={onOpen}
            />
            <ToolExtMenuDrawer
              onClose={onClose}
              isOpen={isOpen}
              btnRef={btnRef}
            />
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
}
