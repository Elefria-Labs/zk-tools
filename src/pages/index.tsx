import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

import Link from 'next/link';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { ToolCard } from '@components/tool-card';
import { allTools } from '../data/tools';
import { ToolsType } from '@types';
import { GithubIcon } from '@components/icon/github';
import { Links, repoLink } from '@config/constants';
import { playgroundToolsList } from '@data/playground';
import { HomeCard } from '@components/home/HomeCard';

const Index = () => {
  const [selectedTools] = useState<string[]>(['snarks', 'circom']);
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
              {/* <Box py={['16px', '16px', '24px']}>
                <Heading
                  color="black"
                  fontSize={['22px', '22px', '28px']}
                  mb={['8px', '8px', '15px']}
                >
                  On-Chain Tools
                </Heading>
                <Text
                  fontSize={['14px', '14px', '16px']}
                  mb="10px"
                  color="black"
                >
                  <Text fontWeight={500} as="span" color="gray">
                    On-Chain Tools
                  </Text>{' '}
                  provides tools to help you navigate evm chains.
                </Text>
                <Divider my="16px" />
                <SimpleGrid
                  columns={[1, 2, 3]}
                  spacing={['10px', '10px', '15px']}
                  mb="48px"
                >
                  {playgroundToolsList
                    .filter((tool) => tool.onChain)
                    .map((tool) => (
                      <HomeCard {...tool} key={tool.title} glow={tool.isBeta} />
                    ))}
                </SimpleGrid>
              </Box> */}
              <Box py={['16px', '16px', '24px']}>
                <Heading
                  color="black"
                  fontSize={['22px', '22px', '28px']}
                  mb={['8px', '8px', '15px']}
                >
                  Dev Tools
                </Heading>
                <Text
                  fontSize={['14px', '14px', '16px']}
                  mb="10px"
                  color="black"
                >
                  <Text fontWeight={500} as="span" color="gray">
                    Dev Tools
                  </Text>{' '}
                  provides list of tools to help you develop on ethereum and evm
                  chains.
                </Text>
                <Flex
                  flexDirection="row"
                  alignContent="center"
                  justifyContent="flex-end"
                >
                  <Link
                    aria-label="Go to Playgrounds"
                    href={Links.devTools}
                    passHref
                  >
                    View All
                  </Link>
                </Flex>
                <Divider my="16px" />
                <SimpleGrid
                  columns={[1, 2, 3]}
                  spacing={['10px', '10px', '15px']}
                  mb="48px"
                >
                  {playgroundToolsList
                    .filter((tool) => tool.isBeta && !tool.onChain)
                    .map((tool) => (
                      <HomeCard {...tool} key={tool.title} glow={tool.isBeta} />
                    ))}
                  {playgroundToolsList
                    ?.filter((tool) => !tool.isBeta && !tool.onChain)
                    .slice(5)
                    .map((tool) => (
                      <HomeCard {...tool} key={tool.title} />
                    ))}
                </SimpleGrid>
              </Box>
              <Box py={['16px', '16px', '24px']}>
                <Heading
                  color="black"
                  fontSize={['22px', '22px', '28px']}
                  mb={['8px', '8px', '15px']}
                >
                  Zk Tools
                </Heading>
                <Flex
                  flexDirection="row"
                  alignContent="center"
                  justifyContent="flex-end"
                >
                  <Link
                    aria-label="Go to Zk Tools"
                    href={Links.zkTools}
                    passHref
                  >
                    View All
                  </Link>
                </Flex>
                <Flex flexDirection="row" alignContent="center">
                  <Link
                    aria-label="Go to GitHub page"
                    href={repoLink}
                    passHref
                    legacyBehavior
                  >
                    <a target="_blank" rel="noopener noreferrer">
                      <Icon
                        as={GithubIcon}
                        display="block"
                        transition="color 0.2s"
                        cursor="pointer"
                        color="black"
                        w="10"
                        h="10"
                        _hover={{ color: 'gray.600' }}
                      />
                    </a>
                  </Link>
                </Flex>
                <Divider my="16px" />
                <SimpleGrid
                  columns={[1, 2, 3]}
                  spacing={['10px', '10px', '15px']}
                  mb="48px"
                >
                  {matchingTools?.slice(4).map((tools: ToolsType) => (
                    <ToolCard {...tools} key={tools.name} />
                  ))}
                </SimpleGrid>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Main>
  );
};

export default Index;
