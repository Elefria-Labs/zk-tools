import React from 'react';
import {
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  Link,
} from '@chakra-ui/react';
import { EditIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { evmToolsXLink } from '@config/constants';
import { TwitterIcon } from '@components/icon/twitter';

type ToolExtMenuDrawerProps = {
  btnRef: React.MutableRefObject<null>;
  isOpen: boolean;
  onClose: () => void;
};
export default function ToolExtMenuDrawer(props: ToolExtMenuDrawerProps) {
  return (
    <Flex alignItems="center">
      <Drawer
        isOpen={props.isOpen}
        placement="right"
        onClose={props.onClose}
        finalFocusRef={props.btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            <Flex flexDir="column" justify="center">
              <a href="http://evmtools.xyz?ref=ext" target="_blank">
                <Button
                  variant="outline"
                  rightIcon={<ExternalLinkIcon />}
                  colorScheme="gray"
                  w="100%"
                >
                  EVM Storage Reader
                </Button>
              </a>

              <Button
                variant="outline"
                rightIcon={<EditIcon />}
                colorScheme="gray"
                w="100%"
                mt={4}
              >
                Request Feature
              </Button>
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <Flex flexDir="column" justify="center" w="100%">
              <Link
                aria-label="Go to X"
                href={evmToolsXLink}
                fontSize="13px"
                target="_blank"
              >
                <Button
                  variant="outline"
                  rightIcon={
                    <Icon
                      as={TwitterIcon}
                      display="block"
                      transition="color 0.2s"
                      cursor="pointer"
                      color="black"
                      w="6"
                      h="6"
                      _hover={{ color: 'gray.600' }}
                    />
                  }
                  colorScheme="gray"
                  w="100%"
                  mt={4}
                >
                  Follow
                </Button>
                {/* <Button
                variant="outline"
                rightIcon={<Icon as={MdAttachMoney} />}
                colorScheme="gray"
                w="100%"
                mt={4}
              >
                Support
              </Button> */}
              </Link>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
