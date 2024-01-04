"use client";
import { geocodeAction } from "@/lib/actions";
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "./ui/input";
import debounce from "lodash/debounce";

export const GeocodeInput = ({ onSelected }: { onSelected?: (selected: any) => void}) => {
  const [address, setAddress] = useState("");
  const [selected, setSelected] = useState<any>();
  const [loading, setLoading] = useState<any>(false);

  const [results, setResults] = useState<{ formatted_address: string }[]>([]);

  // const debouncedGeocode = useCallback(
  //   (address: string) =>
  //     debounce(
  //       (a) =>
  //         geocodeAction(a).then((res) => {
  //           console.log("response: ", res);
  //           setResults(res);
  //         }),
  //       500,
  //       { leading: true, trailing: true },
  //     ),
  //   [],
  // ); // 500ms delay

  const debouncedGeocode = useCallback(
    debounce((address) => {
      setLoading(true);

      geocodeAction(address).then((res) => {
        console.log("response: ", res);
        setResults(res);
        setLoading(false);
      });
    }, 300, { leading: false, trailing: true }), // 500ms delay
    []
  );

  useEffect(() => {
    if (address) {
      debouncedGeocode(address);
    }
  }, [address, debouncedGeocode]);

  // useEffect(() => {
  //   if (address) {
  //     setLoading(true);
  //     geocodeAction(address).then((res) => {
  //       console.log("response: ", res);
  //       setResults(res);
  //     });
  //     setLoading(false);
  //   }
  // }, [address]);

  return (
    <div className="mt-2">
      <Input
        type="text"
        value={address}
        placeholder="123 main st"
        onChange={(e) => {
          setSelected(undefined)
          setAddress(e.target.value)
        }}
      />
      {!selected && (
        <ul>
          {results.map((result, index) => (
            <li
              key={index}
              className="cursor"
              onClick={() => {
                setResults([]);
                setAddress(result.formatted_address);
                setSelected(result);
                if (onSelected) {
                  onSelected(result)
                }
              }}
            >
              {result.formatted_address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
