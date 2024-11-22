import { View, Text, Button } from 'react-native'
import React from 'react'
import useApiHook from './src/api/useApiHook'
import { DEMO_API_FUNC, SECOND_API_FUNC } from './src/api/ApiFunctions'

const App = () => {

  const {
    apiData: firstApiData,
    loadingState: firstApiLoading,
    refetchingApiFunction: firstRefetchFunction,
    apiError: firstApiError
  } = useApiHook({
    apiCallingFunction: DEMO_API_FUNC,
    apiPayload: [{ dw: "dw" }],
    runOnTimeOfScreenMount: true,
    initialLoadingState: true,
    apiCustomReturnFunction: (data: any) => {
      return data;
    },
    onErrorReturnFunction: (err: any) => {
      return err
    },
  })

  const {
    apiData: secondApiData,
    loadingState: secondApiLoading,
    refetchingApiFunction: secondRefetchFunction,
    apiError: secondApiError
  } = useApiHook({
    apiCallingFunction: SECOND_API_FUNC,
    apiPayload: [{ dw: "dw" }],
    runOnTimeOfScreenMount: true,
    initialLoadingState: true,
    apiCustomReturnFunction: (data: any) => {
      return data;
    },
    onErrorReturnFunction: (err: any) => {
      return err
    },
  })


  console.log("Parent loading First----  >", firstApiLoading, " - ", firstApiData, "---", firstApiError);
  console.log("Parent loading Second----  >", secondApiLoading, " - ", secondApiData, "---", secondApiError);
  console.log("--------------- Parent Component Rendering Numbers ---------------")


  return (
    <View>
      <Text>App</Text>
      <Button
        title='Refetch api'
        onPress={async () => {
          console.log("Second time then api and then console last")
          await secondRefetchFunction(
            true,
            [{ name: "hello" }],
            (data: any) => {
              console.log("Called")
              return data
            },
            (err: any) => {
              return err
            })

          console.log("console.log at last")
        }}
      />
    </View>
  )
}

export default App