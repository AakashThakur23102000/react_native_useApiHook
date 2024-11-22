import { useState, useEffect } from 'react';

// Parameter interface 
interface useApiHookInterface {
    apiCallingFunction: Function,
    type?: "API" | "FORMDATA",
    apiPayload: any[],
    apiCustomReturnFunction: Function,
    onErrorReturnFunction: Function,
    runOnTimeOfScreenMount: boolean,
    initialLoadingState: boolean,
}

export const useApiHook = ({
    apiCallingFunction,
    type = "API",
    apiPayload = [],
    runOnTimeOfScreenMount,
    initialLoadingState,
    apiCustomReturnFunction,
    onErrorReturnFunction,
}: useApiHookInterface) => {


    console.log("------------- This hook is working ---------------");

    // Loading state as a useState hook to trigger re-renders
    const [loadingState, setLoadingState] = useState(initialLoadingState);
    const [apiData, setApiData] = useState(null);
    const [apiError, setApiError] = useState(null);


    //some static values
    const fetchHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };


    // Function to call the API
    const apiFetching = async (
        refetchApiPayload?: any[],
        refetchApiCustomReturnFunction?: Function | null,
        refetchOnErrorReturnFunction?: Function | null
    ) => {
        if (type === "API") {
            try {
                var apiCallingFunctionObj = await apiCallingFunction();
                var apiFetchingOptionsObj: any = {};

                apiFetchingOptionsObj["method"] = apiCallingFunctionObj.method
                apiFetchingOptionsObj["headers"] = apiCallingFunctionObj.customHeaders ?
                    apiCallingFunctionObj.customHeaders :
                    fetchHeaders;
                if (apiCallingFunctionObj.method !== "GET") {
                    apiFetchingOptionsObj["body"] = JSON.stringify(
                        refetchApiPayload?.[0] || apiPayload?.[0] || {}
                    )
                }

                // main api calling is done here using fetch
                var apiResponseWithoutConverted = await fetch(apiCallingFunctionObj.fullUrl, apiFetchingOptionsObj)
                var apiResponseAfterConverted = await apiResponseWithoutConverted.json();
                var finalResult;
                if (refetchApiCustomReturnFunction) {
                    finalResult = await refetchApiCustomReturnFunction(apiResponseAfterConverted);
                } else {
                    finalResult = await apiCustomReturnFunction(apiResponseAfterConverted);
                }
                console.log("Wighout Converted --- ", apiResponseWithoutConverted);
                if (apiResponseWithoutConverted.ok) {
                    console.log("Api ok")
                }
                setApiData(finalResult);

            } catch (error: any) {
                var finalError;
                if (refetchOnErrorReturnFunction) {
                    finalError = await refetchOnErrorReturnFunction(error);
                } else {
                    finalError = await onErrorReturnFunction(error);
                }
                setApiError(finalError)
            } finally {
                // Ensure loading state is updated after processing
                setLoadingState((prevState) => {
                    if (prevState !== false) {
                        return false; // Update to false if it's not already false
                    }
                    return prevState; // Keep the same if already false
                });
            }

        } else {

        }

    };

    const refetchingApiFunction = async (
        refetchInitialLoadingState: boolean,
        refetchApiPayload: any[] = [],
        refetchApiCustomReturnFunction?: Function | null,
        refetchOnErrorReturnFunction?: Function | null
    ) => {
        if (refetchInitialLoadingState !== loadingState) {
            setLoadingState(refetchInitialLoadingState);
        }
        await apiFetching(refetchApiPayload, refetchApiCustomReturnFunction, refetchOnErrorReturnFunction);
    }


    // Run the API call when the component mounts, if specified
    useEffect(() => {
        if (runOnTimeOfScreenMount) {
            apiFetching();
        }
    }, []);


    //  final return 
    return { loadingState, apiData, apiError, refetchingApiFunction };
};

export default useApiHook;
