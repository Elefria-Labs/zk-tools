import React from 'react';
import {
  Card,
  CardBody,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon, ExternalLinkIcon, HamburgerIcon } from '@chakra-ui/icons';
import GasPrice from './GasPrice';

export default function ToolExtHeader() {
  return (
    <Flex alignItems="center">
      <Card w="100%" roundedTop={0}>
        <CardBody p={4}>
          <Flex justifyContent="flex-end" alignItems="center">
            <GasPrice />
            <Menu>
              <MenuButton
                ml={8}
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="outline"
              />
              <MenuList>
                <MenuItem icon={<ExternalLinkIcon />}>Web App</MenuItem>
                <MenuItem icon={<EditIcon />}>Feedback</MenuItem>
                {/*             
              <MenuItem icon={<Contribte />} >
                Contribute
              </MenuItem>
               */}
              </MenuList>
            </Menu>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
}
