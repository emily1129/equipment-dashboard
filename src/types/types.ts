export type Status = '生產' | '閒置' | '當機' | '裝機' | '工程借機' | '其他'

export interface StatusChange {
  status: Status
  startTime: string
}

export interface Machine {
  id: string
  statusChanges: StatusChange[]
  currentStatus: Status
}
