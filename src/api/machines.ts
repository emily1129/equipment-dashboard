import api from './config'

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
