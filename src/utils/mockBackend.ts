import { ref } from 'vue'
import axios from 'axios'

interface StatusChange {
  status: '生產' | '閒置' | '當機' | '裝機' | '工程借機' | '其他'
  startTime: string
}

interface Machine {
  id: string
  statusChanges: StatusChange[]
  currentStatus: StatusChange['status']
}

const getRandomTime = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
}

// generate status changes for a machine
const generateStatusChanges = (): StatusChange[] => {
  const statuses: StatusChange['status'][] = ['生產', '閒置', '當機', '裝機', '工程借機', '其他']
  const changes: StatusChange[] = []
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // generate the number of status changes
  const numberOfChanges = Math.floor(Math.random() * 4) + 4

  // Generate status changes
  for (let i = 0; i < numberOfChanges; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const startTime = getRandomTime(startOfDay, now)
    changes.push({ status, startTime })
  }

  // Sort changes by startTime
  changes.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  // Ensure the first change starts at the beginning of the day
  if (changes.length > 0) {
    changes[0].startTime = startOfDay.toISOString()
  }

  return changes
}

// Generate mock data for 30 machines
const mockMachines = ref<Machine[]>(
  Array.from({ length: 30 }, (_, index) => {
    const statusChanges = generateStatusChanges()
    return {
      id: `${String(index + 1).padStart(4, '0')}`,
      statusChanges: statusChanges,
      currentStatus: statusChanges[statusChanges.length - 1].status
    }
  })
)

// Simulated API call
export const fetchMachineData = (): Promise<Machine[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(mockMachines.value))) // Deep copy to simulate fresh data
    }, 500) // Simulate network delay
  })
}

// Commented out real API call for future use
// export const fetchMachineData = async (): Promise<Machine[]> => {
//   try {
//     const { data } = await axios.get('/api/machines');
//     return data;
//   } catch (error) {
//     console.error('Failed to fetch machine data', error);
//     throw error;
//   }
// };

// export const fetchMachineData = async (): Promise<Machine[]> => {
//   try {
//     const { data } = await axios.get('http://127.0.0.1:8000/api/machines')
//     return data
//   } catch (error) {
//     console.error('Failed to fetch machine data', error)
//     throw error
//   }
// }
