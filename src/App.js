import React, { useState } from "react";
import {
  Heading,
  Container,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Stack,
  Box,
  Tooltip,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  CircularProgress,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  useToast,
  StatHelpText,
} from "@chakra-ui/react";

import countryList from "./country.js";
import "./App.css";
import axios from "axios";

function App() {
  const [details, setDetails] = useState({
    firstname: "",
    lastname: "",
    country: "",
  });

  const [modal, setModal] = useState(false);

  const [result, setResult] = useState({});

  const toast = useToast();

  const inputEvents = (event) => {
    setDetails((prev) => {
      if (event.target.name === "firstname") {
        return {
          firstname: event.target.value,
          lastname: prev.lastname,
          country: prev.country,
        };
      } else if (event.target.name === "lastname") {
        return {
          firstname: prev.firstname,
          lastname: event.target.value,
          country: prev.country,
        };
      } else if (event.target.name === "country") {
        return {
          firstname: prev.firstname,
          lastname: prev.lastname,
          country: event.target.value,
        };
      }
    });
  };

  const submitEvent = () => {
    if (
      details.country !== "" &&
      details.firstname !== "" &&
      details.last !== ""
    ) {
      const url = `https://v2.namsor.com/NamSorAPIv2/api2/json/diaspora/${details.country}/${details.firstname}/${details.lastname}`;
      console.log(url);
      axios
        .get(url, {
          headers: {
            "X-API-KEY": "1a6fcaf6a3536fb121746f5d6a8e53ed",
            "Content-type": "application/json;charset=UTF-8",
          },
        })
        .then((response) => {
          setResult(response.data);
          toast({
            title: "Results Fetched",
            description: "Check your result",
            status: "success",
            position: "top-right",
            duration: 5000,
            isClosable: true,
          });
        })
        .finally(() => {
          setModal(true);
        });
    } else {
      toast({
        title: "Incomplete Details",
        description: "Please fill all the details",
        status: "error",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="App">
      <Box w="100%" p={8} h="100vh">
        <Container centerContent>
          <Stack spacing={8}>
            <Tooltip label="Find your Origin" closeDelay={300}>
              <Heading
                fontSize="6xl"
                bgGradient="linear(to-r, teal.500,green.500)"
                bgClip="text"
              >
                Ethnicity Finder
              </Heading>
            </Tooltip>
            <FormControl id="firstname" isRequired>
              <FormLabel>First name</FormLabel>
              <Input
                placeholder="First name"
                focusBorderColor="green.500"
                name="firstname"
                onChange={inputEvents}
              />
            </FormControl>
            <FormControl id="lastname" isRequired>
              <FormLabel>Last name</FormLabel>
              <Input
                placeholder="Last name"
                focusBorderColor="green.500"
                name="lastname"
                onChange={inputEvents}
              />
            </FormControl>
            <FormControl id="country" isRequired>
              <FormLabel>Country</FormLabel>
              <Select
                placeholder="Select country"
                focusBorderColor="green.500"
                name="country"
                onChange={inputEvents}
              >
                {countryList}
              </Select>
            </FormControl>
            <Button
              onClick={submitEvent}
              mt={4}
              color="white"
              bgGradient="linear(to-r, teal.500,green.500)"
              type="submit"
              _hover={{
                bgGradient: "linear(to-r, teal.600,green.600)",
              }}
            >
              Submit
            </Button>
          </Stack>
        </Container>
      </Box>
      <Modal
        onClose={() => {
          setModal(false);
        }}
        isOpen={modal}
        isCentered
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Result</ModalHeader>
          <ModalCloseButton />
          {result.ethnicitiesTop ? (
            <ModalBody>
              <Stack spacing={3}>
                <Stat>
                  <StatLabel>Accuracy</StatLabel>
                  <StatNumber>
                    {Math.round(result.score * 100) / 100}
                    {" %"}
                  </StatNumber>
                  <StatHelpText>
                    Predictions are not always accurate
                  </StatHelpText>
                </Stat>
                <Divider />
                <Stat>
                  <StatLabel>Ethinicity</StatLabel>
                  <StatNumber>{result.ethnicity}</StatNumber>
                  <StatHelpText>
                    Alternate Ethinicity: {result.ethnicityAlt}
                  </StatHelpText>
                </Stat>
                <Divider />
                <Stat>
                  <StatLabel>Other Possible Ethinicities</StatLabel>
                  <StatHelpText>
                    {result.ethnicitiesTop.slice(2).map((e) => (
                      <Text fontSize="xs">{e}</Text>
                    ))}
                  </StatHelpText>
                </Stat>
              </Stack>
            </ModalBody>
          ) : (
            <ModalBody>
              <Center>
                <CircularProgress isIndeterminate color="green.300" />
              </Center>
            </ModalBody>
          )}
          <ModalFooter>
            <Button
              onClick={() => {
                setModal(false);
                setResult({});
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default App;
