import React, { useEffect, useState } from 'react';

import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from '@chakra-ui/react';

import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { ToolsType } from '@types';
import { LinksList } from '@components/link-list';
import { LinksListItem } from '@components/link-list-item';
import useAxios from 'axios-hooks';
import { endpoints } from '@utils/AppConfig';
import { SearchIcon } from '@chakra-ui/icons';
import { TwitterTweetEmbed } from 'react-twitter-embed';

const preDefinedToolTags = ['snarks', 'circom', 'starks', 'semaphore', 'all'];

const Updates = () => {
  const [selectedProject, setSelectedProject] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [matchingTools, setMatchingTools] = useState<ToolsType[] | undefined>();

  const [{ data, loading, error }, refetch] = useAxios(
    'https://reqres.in/api/users?delay=1',
  );

  const [
    { data: tweetData, loading: tweetsLoading, error: tweetsError },
    executePut,
  ] = useAxios(
    {
      url: endpoints.getLatestTweets,
      method: 'POST',
    },
    { manual: true },
  );

  const [
    {
      data: proejctListData,
      loading: projectListLoading,
      error: projectListError,
    },
    executeGetProjectList,
  ] = useAxios(
    {
      url: endpoints.listProjects,
      method: 'POST',
    },
    { manual: true },
  );

  useEffect(() => {
    console.log('selectedProject', selectedProject);
    executePut({ data: { filter: { authorIds: selectedProject } } });
  }, [selectedProject, executePut]);

  useEffect(() => {
    if (searchTerm === '') {
      return;
    }
    executeGetProjectList({
      data: {
        filter: { term: searchTerm },
      },
    });
  }, [executeGetProjectList, searchTerm]);

  // const handleSelection = (tool: string) => {
  //   if (selectedTools.length > 1 && selectedTools.includes(tool)) {
  //     setSelectedTools(selectedTools.filter((t) => t != tool));
  //     return;
  //   }
  //   setSelectedTools([...selectedTools, tool]);
  // };

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
                  zk Project Updates
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
                {/* <Flex flexDirection="row" alignContent="center">
                  <Link aria-label="Go to GitHub page" href={repoLink} passHref>
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
                </Flex> */}
              </Box>
              <Box>
                <Container
                  maxW="container.lg"
                  justifyContent="center"
                  display="flex"
                >
                  <Flex flex={1} justifyContent="space-between">
                    <Flex flexDirection={'column'} width="40%">
                      <InputGroup size="md">
                        <Input
                          placeholder="search..."
                          color="black"
                          borderColor="black"
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setSearchTerm(event.target.value);
                          }}
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
                      </InputGroup>
                      <Box mt="8px">
                        <LinksList>
                          {proejctListData?.projects.map((project: any) => (
                            <LinksListItem
                              href={`/guides/${project._id}`}
                              key={project._id}
                              title={project.name}
                              badgeText={true ? 'NEW' : ''}
                              subtitle={project.twitterUsername}
                              twitterId={project.twitterId}
                              onSelect={(twitterId: string) =>
                                setSelectedProject([twitterId])
                              }
                            />
                          ))}
                        </LinksList>
                      </Box>
                    </Flex>
                    <Flex flexDirection={'column'} width="50%">
                      {tweetsLoading && <Spinner />}
                      {tweetsLoading == false &&
                        tweetData?.tweets?.map((tweet) => (
                          <TwitterTweetEmbed
                            tweetId={tweet.tweet_id}
                            key={tweet._id}
                            options={{
                              cards: 'hidden',

                              maxWidth: 800,
                            }}
                          />
                        ))}
                    </Flex>
                  </Flex>
                </Container>
              </Box>
              <Divider my="24px" />
              {/* <button onClick={refetch}>refetch</button> */}
              {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
              {/* <SimpleGrid
                columns={[1, 2, 3]}
                spacing={['10px', '10px', '15px']}
                mb="48px"
              >
                {matchingTools?.map((tools: ToolsType) => (
                  <ToolCard {...tools} key={tools.name} />
                ))}
              </SimpleGrid> */}
            </Box>
          </Box>
        </Container>
      </Box>
    </Main>
  );
};

export default Updates;
