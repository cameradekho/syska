'use server'

import { mongodb } from "@/lib/mongodb"
import { dataCollectionName, IData } from "@/models/data"
import { ServerActionResult } from "@/types"

export type AddDataResult = ServerActionResult<undefined>

export const addData = async (data: IData): Promise<AddDataResult> => {
  try {
    await mongodb.connect()
    const res = await mongodb.collection<IData>(dataCollectionName).insertOne(data)
    if(!res.acknowledged){
      return {
        success: false,
        message: "failed to add data",
      }
    }
    return {
      success: true,
      data: undefined,
      message:"added successfully",
    }
  } catch (error:any) {
    return {
      success: false,
      message: error.message,
    }
  }
}