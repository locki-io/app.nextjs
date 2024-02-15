'use Client';
import React from "react";

type ScriptProps = {
    isOpen?: boolean;
    nonce: number;
    script: string;
    children?: React.ReactNode;
};

export const ScriptComponent: React.FC<ScriptProps> = (props: ScriptProps) => {
  const { children, nonce, script, isOpen } = props;
  return (
    <>
    <div className="flex justify-center py-4">
        <div className="flex flex-col w-full">
            <h1 className="py-4 mb-0 text-white">Script component {nonce}</h1>
        </div>
    <div className="flex flex-wrap base:flex-row justify-center md:justify-normal gap-x-8 ">{script}</div>
    </div>
    </>
        
  );
};