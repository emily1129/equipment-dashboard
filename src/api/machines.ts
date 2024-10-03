import api from './config'
import { AxiosError } from 'axios'

export interface Machine {
  id: string
  currentStatus: '生產' | '閒置' | '當機' | '裝機' | '工程借機' | '其他'
  statusChanges: Array<{
    status: '生產' | '閒置' | '當機' | '裝機' | '工程借機' | '其他'
    startTime: string
  }>
}

export const fetchMachineData = async (): Promise<Machine[]> => {
  try {
    const { data } = await api.get('/machines')
    return data
  } catch (error) {
    console.error('Failed to fetch machine data', error)
    throw error
  }
}

export const updateMachineData = async (): Promise<Machine[]> => {
  try {
    const { data } = await api.post('/update_machines')
    console.log(data)
    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Failed to update machine data:', error.message)
      // You might want to handle specific error codes here
      if (error.response?.status === 404) {
        throw new Error('Update endpoint not found')
      }
    } else {
      console.error('An unexpected error occurred:', error)
    }
    throw error // Re-throw the error for the caller to handle
  }
}
