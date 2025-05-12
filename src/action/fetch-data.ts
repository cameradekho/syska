"use server"
import { mongodb } from "@/lib/mongodb"
import { dataCollectionName, IData } from "@/models/data"
import { ServerActionResult } from "@/types"

export type FetchDataResult = ServerActionResult<IData[]>

export const fetchData = async (): Promise<FetchDataResult> => {
  try {
    await mongodb.connect()
    const res = await mongodb.collection<IData>(dataCollectionName).find({}).toArray()
    if(!res){
      return {
        success: false,
        message: "failed to fetch data",
      }
    }
    return {
      success: true,
      data: res,
      message:"fetched successfully",
    }
  } catch (error:any) {
    return {
      success: false,
      message: error.message,
    }
  }
}