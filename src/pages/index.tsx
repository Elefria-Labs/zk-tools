import React, { useEffect, useState } from 'react';

import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Tag,
  TagLabel,
} from '@chakra-ui/react';

import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { ToolCard } from '@components/tool-card';
import { allTools } from '../data/tools';
import { ToolsType } from '@types';

const preDefinedToolTags = ['snarks', 'circom', 'starks', 'semaphore', 'all'];
const Index = () => {
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'snarks',
    'circom',
  ]);
  const [matchingTools, setMatchingTools] = useState<ToolsType[] | undefined>();
  useEffect(() => {
    setMatchingTools(
      allTools.filter((tool: ToolsType) => {
        const tags = tool?.tags?.split(',');
        return selectedTools.some(
          (toolTag) => tags?.includes(toolTag) || toolTag.includes(tool.name),
        );
      }),
    );
    if (selectedTools.includes('all')) {
      setMatchingTools(allTools);
    }
  }, [selectedTools]);

  const handleSelection = (tool: string) => {
    if (selectedTools.length > 1 && selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter((t) => t != tool));
      return;
    }
    setSelectedTools([...selectedTools, tool]);
  };
  return (
    <Main
      meta={
        <Meta
          title="Zk Block | Boilerplate for ZK Dapps"
          description="Boilerplate for ZK Dapps | Zero Knowledge Proofs"
        />
      }
    >
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Container maxW="container.lg">
          <Box
            display="flex"
            flexDirection="column"
            justifyItems="space-between"
          >
            <Box>
              <Box py={['23px', '23px', '35px']} color="gray.200">
                <Heading
                  color="black"
                  fontSize={['22px', '22px', '28px']}
                  mb={['8px', '8px', '15px']}
                >
                  Tools
                </Heading>
                {/* <Text
                  fontSize={['14px', '14px', '16px']}
                  mb="10px"
                  color="black"
                >
                  <Text fontWeight={500} as="span" color="gray">
                    zkblock
                  </Text>{' '}
                  is a community effort to collate and develop tools for zero
                  knowledge proofs, to help the developers advance the zero
                  knowledge ecosystem and develop zkdapps.
                </Text> */}
              </Box>
              <Box>
                <Container
                  maxW="container.lg"
                  justifyContent="center"
                  display="flex"
                >
                  <Flex flexDirection={'column'}>
                    {/* <InputGroup size="md" width={[100, 500]}>
                      <Input
                        placeholder="search..."
                        color="black"
                        borderColor="black"
                      />
                      <InputRightElement>
                        <IconButton
                          size="sm"
                          h="1.75rem"
                          aria-label="Search zk tools"
                          icon={<SearchIcon />}
                          color="black"
                        />
                      </InputRightElement>
                    </InputGroup> */}
                    <Box mt="8px" width={[100, 500]}>
                      {preDefinedToolTags.map((tool) => {
                        const isSelected = selectedTools.includes(tool);
                        return (
                          <Tag
                            key={tool}
                            size={'lg'}
                            borderRadius="full"
                            border="1px solid black"
                            variant="solid"
                            onClick={() => handleSelection(tool)}
                            bg={isSelected ? 'black' : 'white'}
                            color={isSelected ? 'white' : 'black'}
                            _hover={{
                              bg: isSelected ? 'gray.600' : 'black',
                              cursor: 'pointer',
                              color: 'white',
                            }}
                            mb={['4px', 0]}
                            ml="8px"
                          >
                            <TagLabel>{tool}</TagLabel>
                            {/* <TagCloseButton /> */}
                          </Tag>
                        );
                      })}
                    </Box>
                  </Flex>
                </Container>
              </Box>
              <Divider my="24px" />
              <SimpleGrid
                columns={[1, 2, 3]}
                spacing={['10px', '10px', '15px']}
                mb="48px"
              >
                {matchingTools?.map((tools: ToolsType) => (
                  <ToolCard {...tools} key={tools.name} />
                ))}
              </SimpleGrid>
            </Box>
          </Box>
        </Container>
      </Box>
    </Main>
  );
};

export default Index;
