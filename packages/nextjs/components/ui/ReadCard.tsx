import { useState } from "react";
import { AbiFunction } from "../../pages/index";
import EyeIcon from "../EyeIcon";
import { displayTxResult } from "../scaffold-eth";
import { useForm } from "react-hook-form";
import { useContractRead } from "wagmi";

export default function ReadCard({ func, abi, contract }: { func: AbiFunction; abi: any; contract: string }) {
  const [readSelected, setReadSelected] = useState(false);
  const [inputValues, setInputValues] = useState<any>({
    // [input.name]: "",
  });
  const { data: contractData, error } = useContractRead({
    chainId: 1,
    abi,
    address: contract,
    functionName: func.name,
    args: Object.values(inputValues),
    enabled: readSelected,
  });

  const {} = useForm();

  return (
    <div className="py-4 border-b border-[#516175] shadow-md my-2  w-auto flex flex-row justify-between items-center">
      <h1>{func.name}</h1>

      <div className="flex flex-col">
        {func.inputs.map(input => {
          return (
            <input
              className="text-[#93A3B8] mb-1 flex-1 pl-2 bg-[#111A2E] py-1  placeholder-[#93A3B8]"
              name={input.name}
              placeholder={input.type}
              key={input.name}
              onChange={e => {
                setInputValues({ ...inputValues, [input.name]: e.target.value });
              }}
            />
          );
        })}
      </div>

      {contractData && readSelected ? (
        <div onClick={() => setReadSelected(false)} className="bg-[#283758] rounded w-auto py-3 px-2">
          {displayTxResult(contractData)}
        </div>
      ) : (
        <div
          onClick={() => {
            setReadSelected(true);
          }}
          className="bg-[#283758] rounded w-auto py-3 px-2"
        >
          <EyeIcon />
        </div>
      )}
    </div>
  );
}
