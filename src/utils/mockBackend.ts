// mockBackend.ts
import { ref } from 'vue'
import axios from 'axios'

interface MachineStatus {
  生產: number
  閒置: number
  當機: number
  裝機: number
  工程借機: number
  其他: number
}

// Initial mock data
const mockData = ref<MachineStatus>({
  生產: 200,
  閒置: 50,
  當機: 100,
  裝機: 75,
  工程借機: 25,
  其他: 100
})

// Function to simulate data changes over time
const updateMockData = () => {
  Object.keys(mockData.value).forEach((key) => {
    mockData.value[key as keyof MachineStatus] += Math.floor(Math.random() * 21) - 10 // Random change between -10 and 10
    mockData.value[key as keyof MachineStatus] = Math.max(
      0,
      mockData.value[key as keyof MachineStatus]
    ) // Ensure non-negative
  })
}

// Simulated API call
export const fetchMachineStatus = (): Promise<MachineStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      updateMockData() // Update data to simulate changes
      resolve({ ...mockData.value })
    }, 500) // Simulate network delay
  })
}

// export const fetchMachineStatus = async (): Promise<MachineStatus> => {
//   try {
//     // deconstruct response
//     const { data } = await axios.get('/api/machine-status')
//     return data
//   } catch (error) {
//     console.error('Failed to fetch machine status', error)
//     throw error
//   }
// }
