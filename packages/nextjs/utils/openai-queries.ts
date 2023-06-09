import { useMutation } from "react-query";

const contractDetailsPrompt = `I'm going to provide you with Ethereum Solidity contract sources code and a contract. You are going to analyze the code and return the following Javascript object:

{
    readableName: string,
    description: string,
    emoji: string,
    usefulMethod: string,
    gasOptimizationScore: string,
}


For readable name, i'd like you to analyze the contract and give me the name of the Main contract in the contract source code. Try to use the contract that is most related to the Contract name. If there are multiple contracts with the same inheritance, use the contract that has the most functions or just default to the contract name if you are not sure.

For description, i'd like you to analyze the contract and give me a short description of what the contract does. Use no more than 10 words.

For emoji, i'd like you to analyze the contract and give me an emoji that best represents the contract. You can use any emoji you want, but please use only one. If you decide you're not able to find an emoji, just use the default emoji of a contract (📜).

For interesting methods, i'd like you to analyze the contract and give me the most interesting function that you think are worth looking at. You can use any function you want. If you decide you're not able to find any interesting functions, you can just give an empty array.

Ensure you have both opening and closing brackets.

Here is the contract:
`;

export const getContractDetails = async (
  query: string,
  contractName: string,
  setReadableContractDetails: () => void,
) => {
  try {
    const response = await fetch("/api/response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: contractDetailsPrompt + query + "Here is the contract Name: " + contractName,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    return data;
  } catch (e) {
    console.log(e);
  }
};

const functionSortingPrompt = `I'm going to provide you with an array of Ethereum smart contract function names. You are going to analyze and reorder the names in a single array. The order of the function names should depend on the usefulness of the function. The most useful function should be at the top of the array and the least useful function should be at the bottom of the array. You should only return an array of function names

[
    "functionName1",
    "functionName2",
]

You should not return any other information. Here are the function names:`;

export const getSortedFunctions = async (query: string) => {
  try {
    const response = await fetch("/api/response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: functionSortingPrompt + query,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    return data;
  } catch (e) {
    console.log(e);
  }
};

export async function readStream(data: ReadableStream): Promise<string> {
  const reader = data.getReader();
  const decoder = new TextDecoder();
  let result = "";
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    result += chunkValue;
  }
  return result;
}

export function useCreateMutation(
  mutationFn: (
    contract: string,
    contractName: string,
    setReadableContractDetails: () => void,
  ) => Promise<ReadableStream<Uint8Array> | null | undefined>,
  onData: (result: any) => void, // Add a callback function for passing the awaited data
) {
  return useMutation(mutationFn, {
    onSuccess: async data => {
      if (!data) {
        return;
      }
      const result = await readStream(data);
      onData(result); // Call the onData callback with the result
    },
    onError: e => {
      if (e instanceof Error) {
        throw new Error(e.message || "Something went wrong!");
      }
    },
  });
}
